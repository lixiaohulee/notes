# interview 

#### 二叉树的中序遍历

```javascript
// 递归版本
const inOrderTraversal = (root) => {
  const res = [];
 
  const visit = (root) => {
    if (root) {
      visit(root.left);
      res.push(root.val);
      visit(root.right);
    }
  }
  
  visit(root);
  
  return res;
}

// 非递归版本

const inOrderTraversal = (root) => {
  const res = [];
  const stack = [];
 
  const curNode = root;
  while(curNode !== null || stack.length !== 0) {
    if (curNode !== null) {
      stack.push(curNode);
      curNode = curNode.left;
    } else {
      curNode = stack.pop();
      res.push(curNode.val);
      curNode = curNode.right;
    }
  }
  
  return res;
}
```

#### Promise 实现

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError(`Promise resolver ${executor} is not a function`);
  }
  
  this.status = PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilled = [];
  this.onRejected = [];
  
  const self = this;
  
  function resolve(value) {
    if (self.status === PENDING) {
      self.status = FUlFILLED;
      self.value = value;
      self.onFulFilled.forEach((callback) => callback());
    }
  }
  
  function reject(reason) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.reason = reason;
      self.onRejected.forEach((callback) => callback());
    }
  }
  
  try {
    executor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}
```

