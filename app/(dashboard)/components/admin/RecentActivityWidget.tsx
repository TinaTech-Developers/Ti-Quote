"use client";

import { Activity, Clock } from "lucide-react";

interface ActivityItem {
  id: string;

  user: string;

  action: string;

  entity: string;

  createdAt: string;
}

interface Props {
  activities: ActivityItem[];
}

export default function RecentActivityWidget({ activities }: Props) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-sm
      "
    >
      {/* HEADER */}

      <div
        className="
        flex
        items-center
        justify-between
        border-b
        border-slate-200
        px-6
        py-5
        "
      >
        <div>
          <h2
            className="
            text-lg
            font-semibold
            text-slate-800
            "
          >
            Recent Activity
          </h2>

          <p
            className="
            mt-1
            text-sm
            text-slate-500
            "
          >
            Latest actions by your team.
          </p>
        </div>

        <Activity className="text-[#0097A7]" size={24} />
      </div>

      {/* LIST */}

      {activities.length === 0 ?
        <div
          className="
          flex
          h-56
          flex-col
          items-center
          justify-center
          gap-3
          text-slate-500
          "
        >
          <Activity size={40} />

          <p>No recent activity.</p>
        </div>
      : <div
          className="
          divide-y
          divide-slate-100
          "
        >
          {activities.map((item) => (
            <div
              key={item.id}
              className="
              flex
              gap-4
              px-6
              py-4
              hover:bg-slate-50
              transition
              "
            >
              <div
                className="
                mt-1
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-cyan-100
                text-[#0097A7]
                "
              >
                <Activity size={17} />
              </div>

              <div className="flex-1">
                <p
                  className="
                  text-sm
                  text-slate-700
                  "
                >
                  <span className="font-semibold">{item.user}</span>{" "}
                  {item.action}{" "}
                  <span className="font-semibold">{item.entity}</span>
                </p>

                <div
                  className="
                  mt-1
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-slate-400
                  "
                >
                  <Clock size={13} />

                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
