"use client"

import AppLayout from "@/components/layouts/AppLayout"
import useUser from "@/hooks/useUser"

const CustomerProfile = () => {
  const { user } = useUser()
  console.log(user)

  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex justify-center items-center p-4">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200 text-center">
            Profile
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                First Name
              </label>
              <input
                type="text"
                value={user.firstName || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Last Name
              </label>
              <input
                type="text"
                value={user.lastName || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Phone Number
              </label>
              <input
                type="text"
                value={user.phoneNumber || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Address
              </label>
              <input
                type="text"
                value={user.address || ""}
                multiple
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                National ID Number
              </label>
              <input
                type="text"
                value={user.nationalIdNumber || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                User Status
              </label>
              <input
                type="text"
                value={user.userRole || ""}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
            {user.outlet && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Outlet
                </label>
                <input
                  type="text"
                  value={user.outlet || ""}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default CustomerProfile
