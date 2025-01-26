"use client"

import AppLayout from "@/components/layouts/AppLayout"
import useUser from "@/hooks/useUser"
import { useState } from "react"

const OutletProfile = () => {
  const { user } = useUser()
  const [outlet, setOutlet] = useState(null)
  const [loadingOutlet, setLoadingOutlet] = useState(false)

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

          {user.outlet && (
            <>
              {loadingOutlet ? (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  Loading outlet details...
                </p>
              ) : outlet ? (
                <>
                  {/* <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Outlet Name
                      </label>
                      <input
                        type="text"
                        value={outlet.name || ""}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Outlet District
                      </label>
                      <input
                        type="text"
                        value={outlet.district || ""}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      />
                    </div> */}
                </>
              ) : (
                <p className="text-center text-red-600 dark:text-red-400">
                  Unable to fetch outlet details.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default OutletProfile
