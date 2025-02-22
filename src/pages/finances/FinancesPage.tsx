
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  CalendarDays,
  Receipt,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for demonstration
const revenueData = [
  { month: "Jan", amount: 150000 },
  { month: "Feb", amount: 180000 },
  { month: "Mar", amount: 210000 },
  { month: "Apr", amount: 160000 },
  { month: "May", amount: 190000 },
  { month: "Jun", amount: 220000 },
];

const expensesByCategory = [
  { name: "Equipment", value: 35 },
  { name: "Travel", value: 25 },
  { name: "Marketing", value: 20 },
  { name: "Staff", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function FinancesPage() {
  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Finances</h1>
            <p className="text-muted-foreground mt-2">
              Manage your business finances and track revenue
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="2024">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Receipt className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <IndianRupee className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </span>
            </div>
            <p className="text-2xl font-semibold mt-2">₹11,45,000</p>
            <div className="flex items-center gap-1 mt-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">12.5%</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <IndianRupee className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </span>
            </div>
            <p className="text-2xl font-semibold mt-2">₹3,25,000</p>
            <div className="flex items-center gap-1 mt-1 text-red-600">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">8.3%</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <PieChart className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Net Profit
              </span>
            </div>
            <p className="text-2xl font-semibold mt-2">₹8,20,000</p>
            <div className="flex items-center gap-1 mt-1 text-blue-600">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">15.2%</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <CalendarDays className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Upcoming Payments
              </span>
            </div>
            <p className="text-2xl font-semibold mt-2">₹2,45,000</p>
            <div className="flex items-center gap-1 mt-1 text-purple-600">
              <span className="text-sm">Next 30 days</span>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-6">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartPieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              {
                date: "Mar 15, 2024",
                description: "Wedding Photography Package",
                amount: "45,000",
                type: "income",
              },
              {
                date: "Mar 14, 2024",
                description: "Camera Equipment Purchase",
                amount: "85,000",
                type: "expense",
              },
              {
                date: "Mar 12, 2024",
                description: "Corporate Event Photography",
                amount: "35,000",
                type: "income",
              },
            ].map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <IndianRupee
                      className={`h-4 w-4 ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-medium ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"} ₹{transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
