export type PredicateFn<T> = (data: T, value: any) => boolean;
export const deepSearchRecordFactory = <T>(
  predicateFn: PredicateFn<T>,
  value: any,
  key: string
) => {
  return function search(data: T[], record = []): number[] {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    record.push(-restNodes.length - 1);

    if (predicateFn(headNode, value)) {
      return record;
    }

    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop();
      }
    }

    if (restNodes.length) {
      record.pop();

      const res = search(restNodes, record);

      if (res) {
        return record;
      }
    }

    return null;
  };
};
