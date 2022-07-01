<template>
  <el-tabs>
    <el-tab-pane label="Информация">
      <el-card shadow="never">
        <model-form v-bind="props" v-bind:validation-schema="schema">
          <template v-slot>
            <model-form-field
              v-slot="{ attrs }: ModelFieldSlotProps<'name'>"
              label="Название"
              v-bind:name="nameof<ModelLocal>('name')"
            >
              <el-input v-bind="attrs" />
            </model-form-field>

            <model-form-field
              v-slot="{ attrs }: ModelFieldSlotProps<'description'>"
              label="Описание"
              v-bind:name="nameof<ModelLocal>('description')"
            >
              <el-input v-bind="attrs" />
            </model-form-field>
          </template>
        </model-form>
      </el-card>
    </el-tab-pane>
  </el-tabs>

  <span>Fallthrough attributes: {{ $attrs }}</span>
</template>

<script lang="ts">
export interface Model extends CreateOrUpdateRoleRequest {}
</script>

<script lang="ts" setup>
import { nameof } from "~/utils";
import { ref } from "vue";
import { object, string } from "yup";
import ModelForm from "~/components/ModelForm.vue";
import ModelFormField from "~/components/ModelFormField.vue";
import type { SchemaOf } from "yup";
import type { FormProps } from "~/components/ModelForm.vue";
import type { FieldSlotProps } from "~/components/ModelFormField.vue";
import type { CreateOrUpdateRoleRequest } from "~/typings";

interface ModelLocal extends CreateOrUpdateRoleRequest {}
interface ModelFieldSlotProps<TKey extends keyof Model>
  extends FieldSlotProps<Model[TKey]> {}

const props = defineProps<FormProps<Model>>();

/* eslint-disable newline-per-chained-call */
const schema: SchemaOf<Omit<Model, "id">> = object({
  name: string().required().min(3).max(256),
  description: string().notRequired(),
});
/* eslint-enable newline-per-chained-call */
</script>
