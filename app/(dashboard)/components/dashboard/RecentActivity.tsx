"use client";

import {
  FileText,
  Receipt,
  CreditCard,
  UserPlus,
  Settings,
} from "lucide-react";

interface Activity {
  id: string;

  action: string;

  description: string;

  createdAt: string;

  user?: {
    name: string;
  };
}

interface Props {
  activities?: Activity[];
}

function ActivityIcon({ action }: { action: string }) {
  const value = action.toLowerCase();

  if (value.includes("invoice")) {
    return <Receipt size={18} />;
  }

  if (value.includes("payment")) {
    return <CreditCard size={18} />;
  }

  if (value.includes("quotation")) {
    return <FileText size={18} />;
  }

  if (value.includes("user")) {
    return <UserPlus size={18} />;
  }

  return <Settings size={18} />;
}

export default function RecentActivity({ activities = [] }: Props) {
  return (
    <div
      className="
rounded-2xl
border
border-slate-200
bg-white
p-6
shadow-sm
"
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>

        <p className="text-sm text-slate-500">Latest system actions</p>
      </div>

      {/* Timeline */}

      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="
flex
gap-4
"
          >
            {/* Icon */}

            <div
              className="
flex
h-10
w-10
shrink-0
items-center
justify-center
rounded-xl
bg-[#0B3954]
text-white
"
            >
              <ActivityIcon action={activity.action} />
            </div>

            {/* Content */}

            <div className="flex-1">
              <div
                className="
flex
flex-col
sm:flex-row
sm:justify-between
"
              >
                <h3
                  className="
font-semibold
text-slate-800
"
                >
                  {activity.action}
                </h3>

                <span
                  className="
text-xs
text-slate-400
"
                >
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>

              <p
                className="
mt-1
text-sm
text-slate-500
"
              >
                {activity.description}
              </p>

              <p
                className="
mt-2
text-xs
font-medium
text-[#0097A7]
"
              >
                By {activity.user?.name || "System"}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p
            className="
text-center
py-8
text-slate-400
"
          >
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
