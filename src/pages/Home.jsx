import { Bell, Calendar, Trophy, Wrench, Megaphone, Users, BookOpen } from 'lucide-react';

const Home = () => {
  const announcements = [
    {
      id: 1,
      title: "Annual Sports Meet 2024",
      date: "2024-03-25",
      category: "sports",
      description: "Join us for the annual inter-hostel sports competition featuring cricket, football, and basketball tournaments.",
      icon: Trophy,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Hostel Maintenance Schedule",
      date: "2024-03-20",
      category: "maintenance",
      description: "Block A water tank cleaning will be conducted. Water supply will be interrupted from 10 AM to 2 PM.",
      icon: Wrench,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: 3,
      title: "Cultural Night",
      date: "2024-03-30",
      category: "event",
      description: "Annual cultural night celebration in the hostel auditorium. All students are invited to participate.",
      icon: Users,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      title: "Library Extended Hours",
      date: "2024-03-22",
      category: "academic",
      description: "The hostel library will remain open until midnight during the exam period.",
      icon: BookOpen,
      color: "bg-green-100 text-green-600"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Mess Menu Updated",
      time: "2 hours ago",
      description: "New mess menu for the month of March has been uploaded.",
      color: "border-blue-500"
    },
    {
      id: 2,
      title: "WiFi Maintenance",
      time: "5 hours ago",
      description: "WiFi services will be under maintenance from 2 AM to 4 AM tomorrow.",
      color: "border-yellow-500"
    },
    {
      id: 3,
      title: "New Gym Equipment",
      time: "1 day ago",
      description: "New fitness equipment has been installed in the gym.",
      color: "border-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg mb-8 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome to HMS</h1>
          <p className="text-indigo-100">Your one-stop solution for hostel management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-lg bg-opacity-90">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
                </div>
              </div>
              <div className="grid gap-6">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start p-4">
                        <div className={`rounded-lg p-3 ${announcement.color} mr-4`}>
                          <announcement.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {announcement.description}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{announcement.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-lg bg-opacity-90">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-8 h-8 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 ${notification.color} p-4 bg-white rounded-lg shadow-sm transform transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-indigo-50 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors text-sm font-medium">
                  Mess Menu
                </button>
                <button className="p-4 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors text-sm font-medium">
                  Room Service
                </button>
                <button className="p-4 bg-yellow-50 rounded-lg text-yellow-600 hover:bg-yellow-100 transition-colors text-sm font-medium">
                  Pay Fees
                </button>
                <button className="p-4 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors text-sm font-medium">
                  Contact Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;