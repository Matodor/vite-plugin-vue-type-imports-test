<template>
  <el-form
    v-loading="loading"
    class="model-form"
    v-bind="(computedFormProps as Object)"
    v-on:submit="onSubmitInternal"
  >
    <slot name="form.before" v-bind="computedSlotProps" />

    <slot name="default" v-bind="computedSlotProps" />

    <template v-if="computedActions.visible">
      <el-form-item class="model-form__actions">
        <slot name="form.actions" v-bind="computedSlotProps">
          <template v-if="computedActions.submitVisible">
            <slot name="form.actions.submit" v-bind="computedSlotProps">
              <el-button
                type="success"
                v-bind:disabled="!meta.valid"
                v-on:click="onSubmitInternal"
              >
                {{ computedActions.submitTitle }}
              </el-button>
            </slot>
          </template>

          <template v-if="computedActions.resetVisible">
            <slot name="form.actions.submit" v-bind="computedSlotProps">
              <el-button
                type="default"
                v-bind:disabled="!meta.dirty"
                v-on:click="handleReset"
              >
                {{ computedActions.resetTitle }}
              </el-button>
            </slot>
          </template>

          <slot name="form.actions.submit" v-bind="computedSlotProps" />
        </slot>
      </el-form-item>
    </template>

    <slot name="form.after" v-bind="computedSlotProps" />

    <el-form-item>
      <div class="bg-gray-200 p-2 rounded w-full">
        {{ errors }}
      </div>
    </el-form-item>

    <el-form-item>
      <div class="bg-gray-400 p-2 rounded w-full">
        {{ values }}
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ElForm, ElMessage } from "element-plus";
import type { FormContext } from "vee-validate";
import type { SchemaOf } from "yup";

export type ElFormPropsFull = InstanceType<typeof ElForm>["$props"];
export type BaseModel = Record<string, any>;

export type ElFormProps = Omit<
  ElFormPropsFull,
  "onValidate" | "validateOnRuleChange"
>;

export interface FormSlotProps<TModel = BaseModel> extends FormContext<TModel> {
  isCreationModelForm?: boolean;
}

export interface FormActionsProps {
  visible?: boolean;
  submitVisible?: boolean;
  submitTitle?: string;
  resetVisible?: boolean;
  resetTitle?: string;
}
</script>

<script lang="ts" setup>
import { computed, ref, toRefs, watch } from "vue";
import { isFunction, isObject } from "@vueuse/core";
import { useForm } from "vee-validate";

export interface FormProps<TModel = BaseModel> {
  initialModel: TModel;
  initialErrors?: Record<keyof TModel, string | undefined>;
  initialTouched?: Record<keyof TModel, boolean>;
  validationSchema: SchemaOf<TModel>;
  formProps?: ElFormProps;
  actions?: FormActionsProps;
  beforeSubmit?: (model: TModel) => void | boolean;
  afterSubmit?: (submitResult: unknown) => void;
  submit?: (model: TModel) => unknown | Promise<unknown>;
  submitFailed?: (error: Error) => void;
  isCreationModelForm?: boolean;
  displaySubmitError?: boolean;
}

const loading = ref<boolean>(false);
const props = withDefaults(defineProps<FormProps>(), {
  initialErrors: undefined,
  initialTouched: undefined,
  formProps: undefined,
  actions: undefined,
  beforeSubmit: undefined,
  afterSubmit: undefined,
  submit: undefined,
  submitFailed: undefined,
  isCreationModelForm: undefined,
  displaySubmitError: true,
});

const {
  initialModel,
  initialErrors,
  initialTouched,
  validationSchema,
  formProps,
  actions,
  beforeSubmit,
  afterSubmit,
  submit,
  submitFailed,
  isCreationModelForm,
  displaySubmitError,
} = toRefs(props);

const formContext = useForm<BaseModel>({
  initialValues: initialModel,
  initialErrors: initialErrors.value,
  initialTouched: initialTouched.value,
  validationSchema,
});

const {
  handleReset,
  handleSubmit,
  resetForm,
  setTouched,
  setErrors,
  validate: validateForm,
  meta,
  errors,
  values,
} = formContext;

const onSubmitInternal = handleSubmit(async (model, actions) => {
  if (isFunction(beforeSubmit.value) && beforeSubmit.value(model) === false) {
    return false;
  }

  loading.value = true;

  if (isFunction(submit.value)) {
    await Promise.resolve(submit.value(model))
      .then((submitResult) => {
        if (isFunction(afterSubmit.value)) {
          afterSubmit.value(submitResult);
        }
      })
      .catch((error) => {
        if (
          displaySubmitError.value === undefined ||
          displaySubmitError.value === true
        ) {
          //
        }

        if (isFunction(submitFailed.value)) {
          submitFailed.value(error as Error);
        }
      });
  }

  loading.value = false;
  return true;
});

const computedFormProps = computed<ElFormProps>(() => ({
  labelPosition: "top",
  ...formProps.value,
}));

const computedActions = computed<FormActionsProps>(() => ({
  visible: true,
  submitVisible: true,
  submitTitle: "Отправить",
  resetVisible: true,
  resetTitle: "Сброс",
  ...actions.value,
}));

const computedSlotProps = computed<FormSlotProps<any>>(() => ({
  ...formContext,
  isCreationModelForm: isCreationModelForm.value,
}));

watch(initialModel, (value) => {
  resetForm(value);
  validateForm().then(
    () => {},
    () => {}
  );
});

watch(initialErrors, (value) => {
  setErrors(value);
});

watch(initialTouched, (value) => {
  setTouched(value);
});

defineExpose({
  model: values,
});
</script>
