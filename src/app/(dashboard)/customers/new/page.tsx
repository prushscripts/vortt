"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCompanyId } from "@/hooks/useCompanyId";

const equipmentSchema = z.object({
  type: z.string().min(1, "Required"),
  brand: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  serial: z.string().optional(),
  installedYear: z.string().optional(),
});

const schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  address: z.string().min(5, "Address required"),
  notes: z.string().optional(),
  equipment: z.array(equipmentSchema),
});

type FormData = z.infer<typeof schema>;

const equipmentTypes = [
  { value: "Central AC", label: "Central AC" },
  { value: "Split AC", label: "Mini-Split / Split AC" },
  { value: "Heat Pump", label: "Heat Pump" },
  { value: "Furnace", label: "Furnace" },
  { value: "Boiler", label: "Boiler" },
  { value: "Rooftop Unit", label: "Rooftop Unit (RTU)" },
  { value: "Other", label: "Other" },
];

export default function NewCustomerPage() {
  const { companyId, loading: companyLoading } = useCompanyId();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { equipment: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "equipment" });

  const onSubmit = async (data: FormData) => {
    setError("");
    if (!companyId) {
      setError("Loading company… try again in a moment.");
      return;
    }
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          companyId,
          equipment: data.equipment.map((e) => ({
            ...e,
            installedYear: e.installedYear ? parseInt(e.installedYear) : undefined,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to create customer");
      router.push("/customers");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <button className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-center hover:bg-[rgba(255,107,43,0.06)] hover:border-[var(--orange)] transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
        </Link>
        <div>
          <h1 className="font-heading font-bold text-2xl text-vortt-charcoal">Add Customer</h1>
          <p className="text-zinc-500 text-sm">New service account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Basic Info */}
        <Card>
          <h2 className="font-heading font-semibold text-vortt-charcoal mb-4">Contact Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Maria"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last Name"
              placeholder="Gonzalez"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label="Phone"
              type="tel"
              placeholder="(512) 555-0000"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="maria@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Service Address"
              placeholder="1420 Oak Street, Austin TX 78701"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Notes"
              placeholder="Gate code, parking instructions, pets, anything the tech should know..."
              rows={3}
              {...register("notes")}
            />
          </div>
        </Card>

        {/* Equipment */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-vortt-charcoal">Equipment</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ type: "Central AC", brand: "", model: "" })}
            >
              <Plus className="w-4 h-4" />
              Add Unit
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-zinc-200 rounded-xl">
              <p className="text-zinc-400 text-sm">No equipment added yet</p>
              <button
                type="button"
                onClick={() => append({ type: "Central AC", brand: "", model: "" })}
                className="text-vortt-orange text-sm font-medium mt-1"
              >
                + Add equipment
              </button>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-600">Unit {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-vortt-red p-1 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Type"
                    options={equipmentTypes}
                    error={errors.equipment?.[index]?.type?.message}
                    {...register(`equipment.${index}.type`)}
                  />
                  <Input
                    label="Brand"
                    placeholder="Carrier"
                    error={errors.equipment?.[index]?.brand?.message}
                    {...register(`equipment.${index}.brand`)}
                  />
                  <Input
                    label="Model"
                    placeholder="24ACC636A"
                    error={errors.equipment?.[index]?.model?.message}
                    {...register(`equipment.${index}.model`)}
                  />
                  <Input
                    label="Year Installed"
                    type="number"
                    placeholder="2020"
                    {...register(`equipment.${index}.installedYear`)}
                  />
                  <div className="col-span-2">
                    <Input
                      label="Serial Number"
                      placeholder="SN123456"
                      {...register(`equipment.${index}.serial`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-vortt-red text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pb-4">
          <Link href="/customers" className="flex-1">
            <Button variant="ghost" fullWidth>Cancel</Button>
          </Link>
          <Button type="submit" fullWidth loading={isSubmitting} disabled={companyLoading || !companyId}>
            Save Customer
          </Button>
        </div>
      </form>
    </div>
  );
}
