<template>
  <el-form-item
    class="model-form__field"
    v-bind:label="label"
    v-bind:error="errorMessage"
  >
    <slot name="default" v-bind="computedSlotProps" />
  </el-form-item>
</template>

<script lang="ts">
export interface FieldSlotProps<TValue = any> extends FieldContext<TValue> {
  attrs: {
    placeholder: string;
    modelValue: TValue;
    "onUpdate:modelValue": (
      e: Event | TValue,
      shouldValidate?: boolean
    ) => void;
  };
}
</script>

<script lang="ts" setup>
import { getInputName } from "~/utils";
import { useField } from "vee-validate";
import { computed, toRefs } from "vue";
import type { PropType } from "vue";
import type { FieldContext } from "vee-validate";
import type { RequireAtLeastOne } from "type-fest";

type InputName =
  | string
  | RequireAtLeastOne<{
      name?: string;
      parentName?: string;
      index?: number;
      postfix?: string;
    }>;

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: [String, Object] as PropType<InputName>,
    required: true,
  },
});

const { name, label } = toRefs(props);

const computedName = computed(() => getInputName(name.value));
const fieldContext = useField(computedName, undefined, {
  label,
});

const { errorMessage, handleChange, value } = fieldContext;

const computedSlotProps = computed<FieldSlotProps>(() => ({
  ...fieldContext,
  attrs: {
    placeholder: "Не заполнено",
    modelValue: value.value,
    "onUpdate:modelValue": handleChange,
  },
}));
</script>
