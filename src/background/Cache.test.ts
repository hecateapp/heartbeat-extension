import Cache from "./Cache";

test("can write and read to the cache", () => {
  const cache = new Cache<boolean>();
  const key = "foo";

  const a = cache.value(key);
  const b = cache.value(key);

  a.set(true);
  expect(a.get() === true);
  expect(b.get() === true);

  b.set(false);
  expect(a.get() === false);
  expect(b.get() === false);
});

test("can observe cache values", () => {
  const cache = new Cache<boolean>();
  const key = "foo";
  cache.value(key).set(false);

  let counter = 0;

  cache.observe(key, newValue => {
    counter++;
  });
  cache.observe(key, newValue => {
    counter++;
  });

  cache.value(key).set(true);
  expect(counter === 2);
});
