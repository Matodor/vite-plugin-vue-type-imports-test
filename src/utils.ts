import { isDef } from "@vueuse/core";
import { isObject } from "lodash";

type InputNameProps = Partial<{
  name: string;
  parentName: string;
  index: number;
  postfix: string;
}>;

type InputName = string | InputNameProps;

function isInputNameProps(
  value: string | InputNameProps
): value is InputNameProps {
  return isObject(value);
}

export function getInputName(inputName: InputName) {
  if (isInputNameProps(inputName)) {
    // eslint-disable-next-line object-curly-newline
    const { name, parentName, index, postfix } = inputName;

    return (
      (isDef(parentName) && name ? `${parentName}.` : "") +
      (isDef(name) ? name : "") +
      (isDef(index) ? `[${index}]` : "") +
      (isDef(postfix) ? `.${postfix}` : "")
    );
  }

  return inputName;
}

export const nameof = <T>(name: Extract<keyof T, string>): string => name;
