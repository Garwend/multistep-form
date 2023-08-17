"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStep,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input, PatternInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextareaAuto } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CreatableInput from "@/components/ui/creatable-input";
import { toast } from "@/components/ui/use-toast";

type FormData = {
  step: number;
  name: string;
  email: string;
  phone: string;
  project: string;
  description: string;
  technologies: string[];
  framework: string;
  experience: string;
};

const firstStepSchema = z.object({
  step: z.literal(1),
  name: z.string().min(1, {
    message: "Required",
  }),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});

const secondStepSchema = firstStepSchema.extend({
  step: z.literal(2),
  project: z.string().min(1, {
    message: "Required",
  }),
  description: z.string(),
  technologies: z
    .string()
    .array()
    .refine((value) => value.some((item) => item), {
      message: "Required",
    }),
});
const thirdStepSchema = secondStepSchema.extend({
  step: z.literal(3),
  framework: z.enum(["react", "vue", "svelte", "angular", "solidjs"]),
  experience: z.enum(["0", "1", "2-3", "4-7", "8"]),
});

const schema = z.discriminatedUnion("step", [
  firstStepSchema,
  secondStepSchema,
  thirdStepSchema,
]);

export default function Home() {
  const maxSteps = 3;

  const form = useForm<FormData>({
    mode: "all",
    shouldFocusError: false,
    resolver: zodResolver(schema),
    defaultValues: {
      step: 1,
      name: "",
      email: "",
      phone: "",
      project: "",
      description: "",
      technologies: [],
    },
  });

  const step = form.watch("step");

  function onSubmit(values: FormData) {
    toast({
      title: "Form data:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const prevStep = () => {
    if (step > 1) {
      form.setValue("step", step - 1, { shouldValidate: true });
    }
  };

  const nextStep = () => {
    if (step < maxSteps) {
      form.setValue("step", step + 1, { shouldValidate: true });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[600px]">
        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormStep
                step={1}
                currentStep={step}
                title="First Step"
                description={`${step}/${maxSteps} - personal information`}
                onPrevStepClick={prevStep}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e-mail..."
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PatternInput
                          format="### ### ###"
                          mask="_"
                          placeholder="phone..."
                          {...field}
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormStep>
              <FormStep
                step={2}
                currentStep={step}
                title="Second Step"
                description={`${step}/${maxSteps} - favorite project`}
                onPrevStepClick={prevStep}
              >
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Input placeholder="project..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project description</FormLabel>
                      <FormControl>
                        <TextareaAuto placeholder="description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <CreatableInput
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormStep>
              <FormStep
                step={3}
                currentStep={step}
                title="Third Step"
                description={`${step}/${maxSteps} - experience`}
                onPrevStepClick={prevStep}
              >
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favorite framework</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="framework..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="vue">Vue</SelectItem>
                          <SelectItem value="svelte">Svelte</SelectItem>
                          <SelectItem value="angular">Angular</SelectItem>
                          <SelectItem value="solidjs">Solidjs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">none</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              1 year
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2-3" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              2-3 years
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4-7" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              4-7 years
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="8" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              8+ years
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormStep>
              <Button
                key={step === maxSteps ? "submit-btn" : "next-step-btn"}
                type={step === maxSteps ? "submit" : "button"}
                className="w-full"
                variant={step === maxSteps ? "default" : "secondary"}
                disabled={!form.formState.isValid}
                onClick={step === maxSteps ? undefined : nextStep}
              >
                {step === maxSteps ? "Submit" : "Next step"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
