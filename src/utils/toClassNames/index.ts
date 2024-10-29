type classNameMap = {
  [key: string]: boolean;
};

export const toClassNames = (
  ...args: (string | classNameMap | undefined)[]
): string => {
  const lastArg = args[args.length - 1];
  const classNameMap =
    typeof lastArg === "object" && lastArg !== null
      ? (lastArg as classNameMap)
      : undefined;

  if (classNameMap === undefined) return args.join(" ");

  const classNames: string[] = [];
  for (const key in classNameMap) {
    if (classNameMap[key]) classNames.push(key);
  }

  const restArgs = args.slice(0, -1);
  if (
    restArgs.every(
      (item) => typeof item === "string" || typeof item === "undefined"
    )
  )
    return restArgs.concat(classNames).join(" ");

  return "";
};
