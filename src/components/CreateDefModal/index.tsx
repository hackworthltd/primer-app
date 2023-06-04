import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UIButton } from "@/components";

import "@/index.css";

export type DefType = "definition" | "type";

export interface CreateDefModalProps {
  /**
   * The type of definition being created.
   */
  defType: DefType;

  /**
   * The names of all existing definitions in the current module that
   * are also in the same namespace as the definition being created.
   * These are checked against the modal's input form for name
   * conflicts.
   *
   * This is a rare case where the frontend assumes something about
   * the language's semantics. Ideally we would move all these checks
   * to the backend, but at the moment, doing this client-side
   * provides better UX. See:
   *
   * https://github.com/hackworthltd/primer-app/issues/942
   */
  moduleDefNames: Set<string>;

  /**
   * The modal's visibility state.
   */
  open: boolean;

  /**
   * The submit button's on-click handler.
   */
  onSubmit: (name: string) => void;

  /**
   * The modal's on-cancel handler. This is called when the student clicks the
   * Cancel button.
   */
  onCancel: () => void;

  /**
   * The modal's on-close handler. This is called when the student presses Esc or
   * clicks outside the modal.
   */
  onClose: () => void;
}

export const CreateDefModal = (p: CreateDefModalProps): JSX.Element => {
  const defFormSchema = z.object({
    defName: z
      .string()
      .trim()
      .min(1, { message: `Please provide a name for the ${p.defType}` })
      .refine((name) => !p.moduleDefNames.has(name), {
        message: `There's already another ${p.defType} with this name in this module`,
      }),
  });

  type FormData = z.infer<typeof defFormSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(defFormSchema),
  });
  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    p.onSubmit(data.defName);
  };

  useEffect(() => {
    if (p.open) {
      setFocus("defName");
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

  return (
    <Transition show={p.open} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white-primary px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-secondary sm:mx-0 sm:h-10 sm:w-10">
                    <SparklesIcon
                      className="h-6 w-6 text-white-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-blue-primary"
                    >
                      Create a new {p.defType}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-blue-primary">
                        Give your new {p.defType} a name. You can rename it
                        later if you change your mind.
                      </p>
                    </div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-5 sm:flex sm:items-center"
                    >
                      <div className="w-full">
                        <label htmlFor="name" className="sr-only">
                          Definition name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="block w-full rounded-md border-grey-primary text-sm shadow-sm focus:ring-blue-secondary"
                          aria-invalid={errors.defName ? "true" : "false"}
                          {...register("defName")}
                          placeholder={`New ${p.defType} name`}
                        />
                        {errors.defName?.message && (
                          <p className="mt-2 text-sm text-red-primary">
                            <span role="alert">{errors.defName.message}</span>
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-5 sm:flex sm:flex-row-reverse">
                  <UIButton
                    text={`Create ${p.defType}`}
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

export default CreateDefModal;
