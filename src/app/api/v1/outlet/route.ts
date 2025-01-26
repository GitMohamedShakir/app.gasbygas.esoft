import { CreateOutletDTO } from "@/app/api/dto/outlet.dto"
import { ValidateBody } from "@/app/api/middleware/validator"
import Outlet from "@/app/api/models/outlet.model"
import User from "@/app/api/models/user.model"
import AuthProvider from "@/app/api/utils/auth"
import DatabaseService from "@/app/api/utils/db"
import { HTTP_STATUS } from "@/constants/common"
import { NextResponse } from "next/server"
import EmailService from "../../lib/EmailService.lib"
import { AuthGuard } from "../../middleware/authenticator"

class OutletController {
  @AuthGuard()
  async GET(req: Request) {
    await DatabaseService.connect()

    const loggedInUser: any = (req as any).user

    if (loggedInUser.userRole !== "OUTLET_MANAGER") {
      return NextResponse.json(
        { message: "You are not allowed to view this outlet." },
        { status: HTTP_STATUS.FORBIDDEN }
      )
    }

    const outlet = await Outlet.findOne({ managerEmail: loggedInUser.email })

    if (!outlet) {
      return NextResponse.json(
        { message: "Outlet not found" },
        { status: HTTP_STATUS.NOT_FOUND }
      )
    }

    // const outlets = await Outlet.find({}).sort({
    //   createdAt: -1,
    // })

    return NextResponse.json(outlet, { status: HTTP_STATUS.OK })
  }
  @AuthGuard()
  @ValidateBody(CreateOutletDTO)
  async POST(req: Request) {
    await DatabaseService.connect()
    const payload: CreateOutletDTO = (req as any).payload

    // Check if an outlet with the same name exists in the district
    const existingOutlet = await Outlet.findOne({
      name: payload.name,
      district: payload.district,
    })

    if (existingOutlet) {
      return NextResponse.json(
        { message: "Outlet already exists in this district" },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }
    // Check if the manager's email is already associated with a user
    const existingUser = await User.findOne({ email: payload.managerEmail })

    if (existingUser) {
      return NextResponse.json(
        { message: "Manager email already exists" },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Create the outlet
    const outlet = await Outlet.create({
      name: payload.name,
      district: payload.district,
      city: payload.city,
      address: payload.address,
      managerName: payload.managerName,
      managerEmail: payload.managerEmail,
      managerPhoneNumber: payload.managerPhoneNumber,
      currentStock: 0,
      stockHistory: [],
    })

    if (!outlet) {
      return NextResponse.json(
        {
          message: "Failed to create the outlet",
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Generate a temporary password for the manager
    const tempPassword = AuthProvider.generateTempPassword()

    // Create a new user for the outlet manager
    await User.create({
      firstName: payload.managerName.split(" ")[0],
      lastName: payload.managerName.split(" ").slice(1).join(" ") || "Manager",
      email: payload.managerEmail,
      userRole: "OUTLET_MANAGER",
      password: await AuthProvider.encryptPassword(tempPassword),
      phoneNumber: payload.managerPhoneNumber,
      address: payload.address,
      outlet: outlet._id,
      requestChangePassword: true,
    })

    // Send the temporary password to the manager's email
    await EmailService.sendOutletCreationEmail(
      payload.managerName,
      payload.managerEmail,
      tempPassword
    )

    return NextResponse.json(
      {
        message: "Outlet and manager account have been created successfully",
        _id: outlet._id,
      },
      { status: HTTP_STATUS.CREATED }
    )
  }
}

export const POST = async (req: Request, res: Response) => {
  const controller = new OutletController()
  try {
    return await controller.POST(req)
  } catch (error: any) {
    console.log("ERRR", error)
    return NextResponse.json(
      {
        message: error.message || "Unknown error",
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    )
  }
}

export const GET = async (req: Request, res: Response) => {
  const controller = new OutletController()
  try {
    return await controller.GET(req)
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Unknown error",
      },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      }
    )
  }
}
