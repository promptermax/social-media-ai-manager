"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock company data
const companies = [
  {
    id: 1,
    name: "Acme Corporation",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    accounts: 5,
  },
  {
    id: 2,
    name: "Globex Industries",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Manufacturing",
    accounts: 3,
  },
  {
    id: 3,
    name: "Stark Enterprises",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Energy",
    accounts: 7,
  },
  {
    id: 4,
    name: "Wayne Enterprises",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    accounts: 4,
  },
  {
    id: 5,
    name: "Umbrella Corporation",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Healthcare",
    accounts: 6,
  },
  {
    id: 6,
    name: "Cyberdyne Systems",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "AI & Robotics",
    accounts: 2,
  },
]

export default function CompanySelectPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCompanySelect = (companyId: number) => {
    // In a real app, you would store the selected company in context/state
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Select a Company</h1>
          <p className="text-gray-600 mt-2">Choose which company you want to manage</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Your Companies</CardTitle>
            <CardDescription>You have access to {companies.length} companies</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search companies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company) => (
                <Button
                  key={company.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-300 transition-all"
                  onClick={() => handleCompanySelect(company.id)}
                >
                  <Avatar className="h-16 w-16 mb-3">
                    <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                    <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium text-base">{company.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{company.industry}</div>
                  <div className="text-xs text-gray-400 mt-2">{company.accounts} social accounts</div>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Button variant="outline" onClick={() => router.push("/admin/companies/new")}>
              Add New Company
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
