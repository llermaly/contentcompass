import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import SideTabs from "./side-tabs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-gray-100">
      <header className="mx-auto w-full max-w-7xl border-b-2 bg-white px-4 pb-2">
        <div className="flex items-center justify-between">
          <Link href="/app">
            <img src="/logo.png" className="h-20" />
          </Link>
          <div className="flex items-center gap-8">
            <Link className="btn btn-neutral" href="/app/quick-compare">
              Quick compare
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-12 bg-white px-4 pb-8 pt-8">
        <aside className="col-span-4 h-full rounded-xl border">
          <SideTabs />
        </aside>
        <div className="col-span-8 ml-12 ">{children}</div>
      </div>
    </main>
  );
};

export default Layout;