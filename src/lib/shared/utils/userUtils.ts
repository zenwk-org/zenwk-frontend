import { Option } from "@app/app/(dashboard)/user/ui/inputs/SelectGeneral";

export const ageGenerator: Option[] = Array.from({ length: 78 }, (_, i) => ({
    label: (i + 13).toString(),
    value: (i + 13).toString(),
}));
