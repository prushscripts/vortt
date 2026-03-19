"use client";

import { useState } from "react";
import { Building2, Phone, MapPin, CreditCard, Bell, Shield, Save } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-vortt-charcoal">Settings</h1>
        <p className="text-zinc-500 text-sm">Manage your company account</p>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Company Info</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4">
          <Input label="Company Name" defaultValue="Smith HVAC Services" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" type="tel" defaultValue="(512) 555-0100" />
            <Input label="Email" type="email" defaultValue="info@smithhvac.com" />
          </div>
          <Input label="Business Address" defaultValue="1200 Industrial Blvd, Austin TX 78701" />
          <Input
            label="Google Review Link"
            placeholder="https://g.page/r/your-link"
            hint="Used in automated review requests after job completion"
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {[
            { label: "New job created", sub: "Notify when a job is scheduled" },
            { label: "Job completed", sub: "Notify when a tech marks a job complete" },
            { label: "Contract expiring", sub: "30-day and 7-day renewal reminders" },
            { label: "Review request pending", sub: "Notify when review requests need approval" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-vortt-charcoal">{item.label}</p>
                <p className="text-xs text-zinc-400">{item.sub}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vortt-orange" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Plan</CardTitle>
          </div>
          <span className="text-xs font-semibold text-vortt-green bg-green-100 px-2 py-0.5 rounded-full">Starter</span>
        </CardHeader>
        <div className="space-y-3">
          <div className="p-4 bg-vortt-mist rounded-xl border border-zinc-200">
            <p className="font-heading font-semibold text-vortt-charcoal">Starter Plan</p>
            <p className="text-sm text-zinc-500 mt-0.5">Up to 3 techs · Core dispatch · AI dispatch suggestions</p>
            <p className="font-heading font-bold text-2xl text-vortt-charcoal mt-2">$99<span className="text-sm font-normal text-zinc-400">/mo</span></p>
          </div>
          <Button variant="secondary" fullWidth>Upgrade to Growth →</Button>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-vortt-orange" />
            <CardTitle>Security</CardTitle>
          </div>
        </CardHeader>
        <div className="space-y-3">
          <Button variant="ghost" fullWidth className="justify-start">Change Password</Button>
          <Button variant="danger" fullWidth className="justify-start">Sign Out of All Devices</Button>
        </div>
      </Card>

      <Button onClick={handleSave} fullWidth size="lg">
        <Save className="w-5 h-5" />
        {saved ? "Saved!" : "Save Settings"}
      </Button>
    </div>
  );
}
