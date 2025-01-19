import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import * as z from "zod";
import {
  Briefcase,
  Building2,
  Calendar,
  Link2,
  MapPin,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Experience } from "@/types/experience";

const experienceFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must not exceed 100 characters"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  location: z.string().max(100, "Location must not exceed 100 characters"),
  type: z.string().max(50, "Type must not exceed 50 characters"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().nullable().optional(),
  current: z.boolean().default(false),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  company_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  achievements: z
    .array(z.string())
    .min(1, "Add at least one achievement")
    .max(10, "Maximum 10 achievements allowed"),
  skills: z.array(z.string()).max(15, "Maximum 15 skills allowed"),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface ExperienceFormProps {
  initialData?: Experience;
  onSubmit: (data: ExperienceFormValues) => void;
  onDelete?: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  onCancel,
}) => {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      company: initialData?.company || "",
      location: initialData?.location || "",
      type: initialData?.type || "",
      start_date: initialData?.start_date
        ? new Date(initialData.start_date)
        : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : null,
      current: initialData?.current || false,
      description: initialData?.description || "",
      company_url: initialData?.company_url || "",
      achievements: initialData?.achievements || [""],
      skills: initialData?.skills || [],
    },
  });

  const { watch, setValue } = form;
  const current = watch("current");

  return (
    <Form {...form}>
      <ScrollArea className="h-[calc(100vh-200px)] pr-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Senior Software Engineer"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="Acme Corp"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="San Francisco, CA"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="https://company.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={current}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {current
                            ? "Present"
                            : field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) =>
                          date > new Date() || date < watch("start_date")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="current"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      if (e.target.checked) {
                        setValue("end_date", null);
                      }
                    }}
                    className="accent-primary"
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  I currently work here
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your role and responsibilities..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Markdown formatting is supported
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="achievements"
            render={() => (
              <FormItem>
                <FormLabel>Key Achievements</FormLabel>
                <div className="space-y-2">
                  {form.watch("achievements").map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Describe an achievement..."
                        value={form.watch(`achievements.${index}`)}
                        onChange={(e) => {
                          const newAchievements = [
                            ...form.watch("achievements"),
                          ];
                          newAchievements[index] = e.target.value;
                          form.setValue("achievements", newAchievements);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newAchievements = form
                            .watch("achievements")
                            .filter((_, i) => i !== index);
                          form.setValue("achievements", newAchievements);
                        }}
                        disabled={form.watch("achievements").length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    form.setValue("achievements", [
                      ...form.watch("achievements"),
                      "",
                    ]);
                  }}
                  disabled={form.watch("achievements").length >= 10}
                >
                  Add Achievement
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="mr-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </form>
      </ScrollArea>
    </Form>
  );
};
