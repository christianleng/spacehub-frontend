"use client";

import * as React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IResourceForm,
  ResourceSchema,
} from "@/app/core/store/resources.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import setToast, { TOAST_TYPE } from "@/components/toast";
import { useResources } from "@/app/core/hooks/store/use-resource";
import { mutate } from "swr";

const CreateResources = observer(() => {
  const isMobile = useIsMobile();
  const [openDatePicker, setOpenDatePicker] = React.useState(false);
  const { createResource, drawerOpen, setDrawerOpen } = useResources();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IResourceForm>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: {
      description: "",
      capacity: 1,
      isActive: true,
      startTime: "09:00:00",
      endTime: "18:00:00",
      date: null,
    },
  });

  const onSubmit = async (values: IResourceForm) => {
    try {
      const created = await createResource(values);
      if (created) {
        reset();
        setDrawerOpen(false);
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Ressource créée",
          message: "Votre ressource a bien été ajoutée !",
        });
        mutate("FETCH_RESOURCES");
      }
    } catch (err) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Erreur",
        message: "Impossible de créer la ressource.",
      });
    }
  };

  return (
    <Drawer
      open={drawerOpen}
      onOpenChange={setDrawerOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Créer une ressource</DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="capacity">Capacité</Label>
            <Input
              id="capacity"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm">{errors.capacity.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-between font-normal"
                    >
                      {field.value
                        ? field.value.toLocaleDateString()
                        : "Choisir une date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(val) => {
                        field.onChange(val ?? null);
                        setOpenDatePicker(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex gap-4">
            <div>
              <Label htmlFor="startTime">Heure de début</Label>
              <Input type="time" step="1" {...register("startTime")} />
            </div>
            <div>
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input type="time" step="1" {...register("endTime")} />
            </div>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Annuler</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
});

export default CreateResources;
