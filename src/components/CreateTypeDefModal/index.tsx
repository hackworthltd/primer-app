import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MinusIcon, PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UIButton } from "@/components";

import "@/index.css";

export interface CreateTypeDefModalProps {
  /**
   * The names of all existing typedefs in the current module.
   */
  moduleTypeDefNames: Set<string>;

  /**
   * The modal's visibility state.
   */
  open: boolean;

  /**
   * The submit button's on-click handler.
   */
  onSubmit: (typeName: string, ctorNames: string[]) => void;

  /**
   * The modal's on-cancel handler. This is called when the user clicks the
   * Cancel button.
   */
  onCancel: () => void;

  /**
   * The modal's on-close handler. This is called when the user presses Esc or
   * clicks outside the modal.
   */
  onClose: () => void;
}

// This is a bit silly, but react-hook-form wants it to be a struct for some
// reason.
const ctorInputSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Please either name this constructor, or delete it",
  }),
});

export const CreateTypeDefModal = (p: CreateTypeDefModalProps): JSX.Element => {
  const typeDefFormSchema = z
    .object({
      typeName: z
        .string()
        .trim()
        .min(1, { message: "Please provide a name for the type" })
        .refine((name) => !p.moduleTypeDefNames.has(name), {
          message:
            "Type names must be unique, but there's already a type with this name in this module",
        }),
      ctor: z.array(ctorInputSchema),
    })
    .superRefine((val, ctx) => {
      const seen = new Set();

      for (const [i, ctor] of val.ctor.entries()) {
        // TODO: add a check for duplicate value constructor names within this module.
        //
        // https://github.com/hackworthltd/primer/issues/830

        if (ctor.name === val.typeName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `The type name can't be the same as any of the value constructor names`,
            path: ["ctor", i, "name"],
          });
        }

        if (seen.has(ctor.name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Value constructor names must be unique, but this type has multiple value constructors named "${ctor.name}"`,
            path: ["ctor", i, "name"],
          });
        }

        seen.add(ctor.name);
      }
    });

  type FormData = z.infer<typeof typeDefFormSchema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(typeDefFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "ctor",
    control,
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    p.onSubmit(
      data.typeName,
      data.ctor.map((c) => c.name)
    );
  };

  useEffect(() => {
    if (p.open) {
      setFocus("typeName");
    }
  }, [p.open, setFocus]);

  const onClose = () => {
    reset();
    p.onClose();
  };

  const onCancel = () => {
    reset();
    p.onCancel();
  };

  const iconClasses = "w-5 stroke-blue-primary stroke-[3px]";

  return (
    <Transition show={p.open} as={Fragment}>
      <Dialog className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-grey-primary/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white-primary px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-secondary sm:mx-0 sm:h-10 sm:w-10">
                    <SparklesIcon
                      className="h-6 w-6 text-white-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-blue-primary"
                    >
                      Define a new type
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-blue-primary">
                        Define your new type by giving it a name.
                      </p>
                    </div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-5 sm:flex sm:items-center"
                    >
                      <div className="w-full">
                        <label htmlFor="typeName" className="sr-only">
                          Type name
                        </label>
                        <input
                          type="text"
                          id="typeName"
                          className="block w-full rounded-md border-grey-primary text-sm shadow-sm focus:ring-blue-secondary"
                          aria-invalid={errors.typeName ? "true" : "false"}
                          {...register("typeName")}
                          placeholder="Type name"
                        />
                        {errors.typeName?.message && (
                          <p className="mt-2 text-sm text-red-primary">
                            <span role="alert">{errors.typeName.message}</span>
                          </p>
                        )}
                        {fields.map((field, index) => {
                          return (
                            <div key={field.id} className="p-2">
                              <div className="flex gap-2">
                                <button onClick={() => remove(index)}>
                                  <MinusIcon className={iconClasses} />
                                </button>
                                <input
                                  type="text"
                                  id={`constructorName${index}`}
                                  className="block w-full rounded-md border-grey-primary text-sm shadow-sm focus:ring-blue-secondary"
                                  aria-invalid={
                                    errors.ctor?.[index]?.name
                                      ? "true"
                                      : "false"
                                  }
                                  {...register(`ctor.${index}.name` as const)}
                                  placeholder="Value constructor name"
                                />
                              </div>
                              {errors?.ctor?.[index]?.name && (
                                <p className="mt-2 text-sm text-red-primary">
                                  <span role="alert">
                                    {errors?.ctor?.[index]?.name?.message}
                                  </span>
                                </p>
                              )}
                            </div>
                          );
                        })}
                        <div>
                          <button
                            onClick={() =>
                              append({
                                name: "",
                              })
                            }
                          >
                            <PlusIcon className={iconClasses} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <UIButton
                    text="Create type"
                    size="lg"
                    appearance="primary"
                    className="w-full justify-center sm:ml-3 sm:w-auto"
                    onClick={handleSubmit(onSubmit)}
                  />
                  <UIButton
                    text="Cancel"
                    size="lg"
                    appearance="plain"
                    className="mt-3 w-full justify-center sm:mt-0 sm:w-auto"
                    onClick={onCancel}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateTypeDefModal;
