```js in station controller it is mock
function operatorId(req) {
  return (
    req.user?.id || req.user?._id || req.user?.sub || "6a75f01a440d1688108bb0ec"
  );
}
```
