function logProperty(
    target: any,
    key: string
) {}
function logClass() {}
function logMethod() {}
function logParam() {}

@logClass
class Test{
  @logProperty
  name: string = 'name';

  @logMethod
  rename(@logParam name: string) {}
}
