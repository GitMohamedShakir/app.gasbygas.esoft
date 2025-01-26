"use client"

import AuthRoleCheck from "@/components/Auth"
import AppLayout from "@/components/layouts/AppLayout"
import Modal from "@/components/modal"
import ViewOutlet from "@/components/outlets/ViewOutlet"
import Button from "@/components/subcomponents/button"
import Input from "@/components/subcomponents/input"
import Select from "@/components/subcomponents/select"
import { Table } from "@/components/table"
import { Dispatch, RootState } from "@/data"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import AreasList from "../../../public/areas.json"
import { UserRole } from "../api/types/user"

const DistrictsList = Object.keys(AreasList).map((d) => ({
  label: d,
  value: d,
}))

const CitiesList = (district: string) =>
  ((AreasList as any)[district]?.cities || []).map((c: string) => ({
    label: c,
    value: c,
  }))

function Outlets() {
  const dispatch = useDispatch<Dispatch>()

  const outlets = useSelector((state: RootState) => state.outlets.list)

  useEffect(() => {
    dispatch.outlets.fetchOutlets()
  }, [])

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [currentOutlet, setCurrentOutlet] = useState<{
    id: string
    action: string
  } | null>(null)

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    district: "",
    city: "",
    name: "",
    address: "",
    managerName: "",
    managerEmail: "",
    managerPhoneNumber: "",
  })

  const [formErrors, setFormErrors] = useState({
    district: "",
    city: "",
    name: "",
    address: "",
    managerName: "",
    managerEmail: "",
    managerPhoneNumber: "",
  })

  const columns = [
    { key: "name", label: "Name" },
    { key: "district", label: "District" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "managerName", label: "Name" },
    { key: "managerEmail", label: "Email" },
    { key: "managerPhoneNumber", label: "Tel" },
  ]

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setFormData({
      district: "",
      city: "",
      name: "",
      address: "",
      managerName: "",
      managerEmail: "",
      managerPhoneNumber: "",
    })
    setFormErrors({
      district: "",
      city: "",
      name: "",
      address: "",
      managerName: "",
      managerEmail: "",
      managerPhoneNumber: "",
    })
    setIsPopupOpen(false)
  }

  const handleChangeField = (field: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }))
  }

  const validateForm = () => {
    const errors = {
      district: "",
      city: "",
      name: "",
      address: "",
      managerName: "",
      managerEmail: "",
      managerPhoneNumber: "",
    }
    let isValid = true

    if (!formData.district) {
      errors.district = "District is required"
      isValid = false
    }

    if (!formData.name) {
      errors.name = "Outlet name is required"
      isValid = false
    }

    if (!formData.address) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!formData.managerName) {
      errors.managerName = "Manager name is required"
      isValid = false
    }

    if (!formData.managerEmail) {
      errors.managerEmail = "Manager email is required"
      isValid = false
    }

    if (!formData.managerPhoneNumber) {
      errors.managerPhoneNumber = "Manager phone number is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const data = await dispatch.outlets.createOutlet(formData)
      toast.success(
        data?.message ||
          "Outlet and manager account have been created successfully"
      )
      dispatch.outlets.fetchOutlets()

      handleClosePopup()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Unknown error occurred!")
      console.log("Create outlet failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onViewOutlet = (item: any) => {
    setCurrentOutlet({ id: item._id, action: "view" })
  }

  const onEditOutlet = (item: any) => {
    setCurrentOutlet({ id: item._id, action: "edit" })
  }

  const onDeleteOutlet = (item: any) => {
    setCurrentOutlet({ id: item._id, action: "delete" })
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">
          Outlets
        </h1>

        {/* Add Outlet Button */}
        <div className="my-2">
          <Button text=" Create Outlet" onClick={handleOpenPopup} />
        </div>

        {/* Outlets Table */}
        <Table
          columns={columns}
          data={outlets}
          actions={[
            { label: "View Outlet", onClick: onViewOutlet },
            { label: "Edit Outlet", onClick: onEditOutlet },
            { label: "Delete Outlet", onClick: onDeleteOutlet },
          ]}
        />

        <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
          <Modal.Header>Create Outlet</Modal.Header>
          <Modal.Content>
            <div className="mb-2">
              <Select
                label="District"
                value={formData.district}
                options={DistrictsList}
                onChange={handleChangeField.bind(null, "district")}
                error={formErrors.district}
              />
            </div>

            <div className="mb-2">
              <Select
                label="City"
                value={formData.city}
                options={CitiesList(formData.district)}
                onChange={handleChangeField.bind(null, "city")}
                error={formErrors.city}
              />
            </div>

            <div className="mb-2">
              <Input
                id=""
                label="Outlet Name"
                value={formData.name}
                onChange={handleChangeField.bind(null, "name")}
                error={formErrors.name}
              />
            </div>
            <div className="mb-2">
              <Input
                id=""
                label="Address"
                value={formData.address}
                onChange={handleChangeField.bind(null, "address")}
                error={formErrors.address}
              />
            </div>

            <div className="mb-2">
              <Input
                id=""
                label="Manager Name"
                value={formData.managerName}
                onChange={handleChangeField.bind(null, "managerName")}
                error={formErrors.managerName}
              />
            </div>
            <div className="mb-2">
              <Input
                id=""
                label="Manager Email"
                value={formData.managerEmail}
                onChange={handleChangeField.bind(null, "managerEmail")}
                error={formErrors.managerEmail}
              />
            </div>

            <div className="mb-2">
              <Input
                id=""
                label="Manager Phone Number"
                value={formData.managerPhoneNumber}
                onChange={handleChangeField.bind(null, "managerPhoneNumber")}
                error={formErrors.managerPhoneNumber}
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex justify-end gap-2">
              <Button
                text="Submit"
                isLoading={isLoading}
                onClick={handleSubmit}
              />
              <Button
                text="Cancel"
                color="secondary"
                onClick={handleClosePopup}
              />
            </div>
          </Modal.Footer>
        </Modal>
        {currentOutlet && currentOutlet.action === "view" && (
          <ViewOutlet
            id={currentOutlet.id}
            onClose={() => setCurrentOutlet(null)}
          />
        )}

        {currentOutlet && currentOutlet.action === "delete" && (
          <div>
            <h2>Are you sure you want to delete this outlet?</h2>
            <div className="flex justify-end gap-2">
              <Button
                text="Delete"
                color="secondary"
                onClick={() => dispatch.outlets.deleteOutlet(currentOutlet?.id)}
              />
              <Button text="Cancel" onClick={() => setCurrentOutlet(null)} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default AuthRoleCheck(Outlets, { roles: [UserRole.DISTRIBUTOR] })
