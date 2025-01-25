import { AuthGuard } from "@/app/api/middleware/authenticator"
import User from "@/app/api/models/user.model"
import DatabaseService from "@/app/api/utils/db"
import { HTTP_STATUS } from "@/constants/common"
import { NextResponse } from "next/server"

class Controller {
  @AuthGuard()
  async get(req: Request) {
    const userId = (req as any).userId

    await DatabaseService.connect()

    // Find the user by email
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Return the response with user
    return NextResponse.json(
      {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userRole: user.userRole,
          email: user.email,
          outlet: user.outlet,
          requestChangePassword: user.requestChangePassword,
          nationalIdNumber: user.nationalIdNumber,
          businessRegId: user.businessRegId,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      },
      { status: HTTP_STATUS.OK }
    )
  }
}

export const GET = async (req: Request, res: Response) => {
  const controller = new Controller()
  try {
    return await controller.get(req)
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
