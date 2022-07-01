type Foo = [[number, number], [number, number]];
type Bar = Foo;
type BaseModel = Record<string, any>;

export interface Props<T extends BaseModel = BaseModel> {
  initialModel: T;
  validationSchema: any;
  foo: Foo;
  bar: Bar;
}

export interface CreateOrUpdateRoleRequest {
  id: number | null;
  name: string;
  description: string | null;
}
