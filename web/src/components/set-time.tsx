"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { useSocket } from "@/providers/socket-provider";
import { Button } from "./ui/button";
import { ClockIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";


export const SetTime = () => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <ClockIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col space-y-2 font-inter">
        <SetTimeForm
          onSuccess={() => {
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

const formSchema = z.object({
  days: z.coerce.number().min(0).max(99),
  hours: z.coerce.number().min(0).max(23),
  mins: z.coerce.number().min(0).max(59),
  sec: z.coerce.number().min(0).max(59),
});
const ONE_SECOND = 1000;
const ONE_MIN = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MIN;
const ONE_DAY = 24 * ONE_HOUR;
const SetTimeForm = ({ onSuccess }: { onSuccess(): void }) => {
  const { socket } = useSocket();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: 0,
      hours: 0,
      mins: 0,
      sec: 0,
    },
  });
  function onSubmit({ days, hours, mins, sec }: z.infer<typeof formSchema>) {
    socket?.emit(
      "setTime",
      days * ONE_DAY + hours * ONE_HOUR + mins * ONE_MIN + sec * ONE_SECOND,
    );
    onSuccess();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-2"
      >
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="00"
                  className="remove-arrow w-[4ch] pl-2 pr-1"
                  autoComplete="off"
                />
              </FormControl>
              <FormLabel className="mt-0">DD</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="00"
                  className="remove-arrow w-[4ch] pl-2 pr-1"
                  autoComplete="off"
                />
              </FormControl>
              <FormLabel>HH</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mins"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="00"
                  className="remove-arrow w-[4ch] pl-2 pr-1"
                  autoComplete="off"
                />
              </FormControl>
              <FormLabel>MM</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sec"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="00"
                  className="remove-arrow w-[4ch] pl-2 pr-1"
                  autoComplete="off"
                />
              </FormControl>
              <FormLabel>SS</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="col-start-4">Submit</Button>
      </form>
    </Form>
  );
};
