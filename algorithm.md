# 算法笔记 

#### 二叉树迭代遍历

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */


/**
# 中序遍历 先遍历左子树->根节点->右子树
# 如果是递归做法则递归遍历左子树，访问根节点，递归遍历右子树
# 非递归过程即:先访问..最左子树..结点，再访问其父节点，再访问其兄弟
# while循环条件 中序遍历需先判断当前结点是否存在，若存在则将该节点放入栈中，再将当前结点设置为结点的左孩子，
# 若不存在则取栈顶元素为cur，当且仅当栈空cur也为空，循环结束。
*/

function inorderTraversal(root: TreeNode | null): number[] {
    const res = [];
    const stack = [];

  
    while(root || stack.length) {
        if (root) {
            stack.push(root);
            root = root.left;
        } else {
            const temp= stack.pop();
            res.push(temp.val);
            root = temp.right;
        }
    }

    return res;   
};

```



##### 二叉树递归遍历 

```javascript
function inorderTraversal(root: TreeNode | null): number[] {
    const res = [];

    const visitNode = (root: TreeNode) => {
        if (root === null) return;
        
        visitNode(root.left);
        res.push(root.val);
        visitNode(root.right);
    }

    visitNode(root);

    return res;
}
```



##### 二叉树层序遍历

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if (root === null) return [];
    
    const res = [];
    const queue = [];

    queue.push(root);

    while(queue.length) {
        const len = queue.length;

        const temp = [];
        for(let i = 0; i < len; i++) {
            const head = queue.shift();
            temp.push(head.val);
            
            if (head.left) {
                queue.push(head.left);
            }

            if (head.right) {
                queue.push(head.right);
            }
        }

        res.push(temp);
    }

    return res;
};
```



##### 填充每个节点的下一个右侧节点指针

```javascript
/**
 * // Definition for a Node.
 * function Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {Node} root
 * @return {Node}
 */
function connect(root) {
    if (root === null) return null;

    const connnectHelper = (n1, n2) => {
        if (n1 === null || n2 === null) return;

        n1.next = n2;

        connnectHelper(n1.left, n1.right);
        connnectHelper(n2.left, n2.right);
        connnectHelper(n1.right, n2.left);
    }

    connnectHelper(root.left, root.right);

    return root;
};
```



##### 转二叉树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function invertTree(root: TreeNode | null): TreeNode | null {
    if (root === null) return null;

    const temp = root.left;
    root.left = root.right;
    root.right = temp;

    invertTree(root.left);
    invertTree(root.right);

    return root;
};
```



----

> 2022-01-28



##### 快速排序

```javascript
function sortArray(nums) {
  partition(nums, 0, nums.length -1);

};

const partition = (nums, _left, _right) => {
  let left = _left;
  let right = _right;

  const reference = nums[left];

  if (left < right) {
      while(left < right) {
          while(left < right && nums[right] >= reference) {
              right--;
          }
          nums[left] = nums[right];

          while(left < right && nums[left] <= reference) {
              left++;
          }
          nums[right] = nums[left];
      }
      nums[left] = reference;
      partition(nums, 0, left-1);
      partition(nums, left+1, _right);
  }
 
}


const arr = [5,3,566,23,57,35,7,7,3,4,6,6,8,3,3];
sortArray(arr);

console.log(arr.toString());


```

##### 二叉树转为链表	

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

/**
 Do not return anything, modify root in-place instead.
 */
function flatten(root: TreeNode | null): void {
    if (root === null) return;

    flatten(root.left);
    flatten(root.right);
    
    const left = root.left;
    const right = root.right;

    root.left = null;
    root.right = left;

    let current = root;
    
    while(current && current.right) {
        current = current.right;
    } 
    current.right = right;

};
```

##### 最大二叉树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */


function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
    if (nums.length === 0) return null;

    let max = Number.MIN_VALUE;
    let maxIndex = 0;

    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i];
            maxIndex = i;  
        }
    }

    const root = new TreeNode(max);

    root.left = constructMaximumBinaryTree(nums.slice(0, maxIndex));
    root.right = constructMaximumBinaryTree(nums.slice(maxIndex+1));

    return root;
};
```

##### 根据前序遍历和中序遍历恢复二叉树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    if (preorder.length === 0) return null;

    const rootVal = preorder[0];
    const rootValIndexInOrder = inorder.findIndex((num) => num === rootVal);

    const root = new TreeNode(rootVal);

    root.left = buildTree(preorder.slice(1, rootValIndexInOrder+1), inorder.slice(0, rootValIndexInOrder));
    root.right = buildTree(preorder.slice(rootValIndexInOrder+1), inorder.slice(rootValIndexInOrder+1));

    return root;
};
```

##### 根据中序遍历和后续遍历恢复二叉树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
    if (postorder.length === 0) return null;

    const rootVal = postorder[postorder.length-1];
    const rootValIndexInInorder = inorder.findIndex(num => num === rootVal);

    const root = new TreeNode(rootVal);

    root.left = buildTree(inorder.slice(0, rootValIndexInInorder), postorder.slice(0, rootValIndexInInorder));
    root.right = buildTree(inorder.slice(rootValIndexInInorder+1), postorder.slice(rootValIndexInInorder, postorder.length-1));

    return root;
};
```

##### 二叉树的序列化和反序列化

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

/*
 * Encodes a tree to a single string.
 */
function serialize(root: TreeNode | null): string {
    let res = '';

    const preOrder = (root: TreeNode | null): void => {
        if (root === null) {
            res += '#,';
            return;
        }

        res += `${root.val},`;

        preOrder(root.left);
        preOrder(root.right);
    }

    preOrder(root);

    return res;
};

/*
 * Decodes your encoded data to tree.
 */
function deserialize(data: string): TreeNode | null {
    if (!data) return null;

    const nodeList = data.split(',');

    const helper = (nodeList: Array<string>) => {
        if (!nodeList.length) return null;

        const node = nodeList.shift();

        if (node === '#') return null;

        const root = new TreeNode(+node);

        root.left = helper(nodeList);
        root.right = helper(nodeList);

        return root;
    }

    return helper(nodeList);
};


/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */


function findDuplicateSubtrees(root: TreeNode | null): Array<TreeNode | null> {
    const res = {};
    const cache = [];

    const findHelper = (root: TreeNode | null): string => {
        if (root === null) return '#';
        
        const left = findHelper(root.left);
        const right = findHelper(root.right);

        const subTreeStr = left + ',' + right + ',' + root.val;

        if (cache.find(str => str === subTreeStr)) {
            if (!res[subTreeStr]) {
                res[subTreeStr] = root;
            }
        } else {
            cache.push(subTreeStr);
        }

        return subTreeStr;
        
    }
    findHelper(root);

    return Object.values(res);
};
```



> 如果当前的节点要做的事情需要通过左右子树的计算结果推导出来 那么就是需要用到后续遍历的时候了。



##### 二叉搜索子树的最大键值和

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function maxSumBST(root: TreeNode | null): number {
    let maxSum = 0;

    const helper = (root: TreeNode | null) => {
        if (root === null) {
            return {
                isBST: true,
                maxLeftTree: Number.MIN_SAFE_INTEGER,
                minRightTree: Number.MAX_SAFE_INTEGER,
                sum: 0,
            }
        }

        const leftRes = helper(root.left);
        const rightRes = helper(root.right);

        if (leftRes.isBST && rightRes.isBST && root.val > leftRes.maxLeftTree && root.val < rightRes.minRightTree) {
            const sum = root.val + leftRes.sum + rightRes.sum;
            maxSum = Math.max(maxSum, sum);
            return {
                isBST: true,
                maxLeftTree: Math.max(root.val, leftRes.maxLeftTree),
                minRightTree: Math.min(root.val, rightRes.minRightTree),
                sum,
            }
        } else {
            return {
                isBST: false
            }
        }
        
    }

    helper(root);

    return maxSum;
};
```



### 二叉树的最近公共祖先

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
	if (root === null) return null;
    if (root === p || root === q) return root;

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    if (left && right) return root;
    if (left === null && right === null) return null;
    
    return left === null ? right : left;
};
```

### 二分查找

```javascript
const binarySearch = (nums: number[], left: number, right: number, target: number): number => {
    if (left > right) return -1;

    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
        return mid;
    }

    if (target < nums[mid]) {
        return binarySearch(nums, left, mid-1, target);
    }

    if (target > nums[mid]) {
        return binarySearch(nums, mid+1, right, target);
    }
}

function search(nums: number[], target: number): number {
    return binarySearch(nums, 0, nums.length-1, target);
};
```



### 另一棵树的子树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */


const isSameTree = (root: TreeNode | null, subRoot: TreeNode | null): boolean => {
    if (root === null && subRoot === null) return true;

    return root && subRoot && root.val === subRoot.val && isSameTree(root.left, subRoot.left) && isSameTree(root.right, subRoot.right);
}

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    if (root === null && subRoot === null) return true;
    if (root === null && subRoot !== null) return false;
    return isSameTree(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};
```



### 恢复二叉搜索树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

/**
 Do not return anything, modify root in-place instead.
 */

const getMaximum = (root: TreeNode | null): TreeNode | null => {
    if (root === null) return null;
    
    let maximumVal = Number.MIN_SAFE_INTEGER;
    let maximumNode = null;

    const preOrder = (root: TreeNode | null): void => {
        if (root === null) return;

        if (root.val > maximumVal) {
            maximumVal = root.val;
            maximumNode = root;
        }

        preOrder(root.left);
        preOrder(root.right);
    }

    preOrder(root);

    return maximumNode;
}
const getMinimum = (root: TreeNode | null): TreeNode | null => {
    if (root === null) return null;
    
    let minimumVal = Number.MAX_SAFE_INTEGER;
    let minimumNode = null;

    const preOrder = (root: TreeNode | null): void => {
        if (root === null) return;

        if (root.val < minimumVal) {
            minimumVal = root.val;
            minimumNode = root;
        }

        preOrder(root.left);
        preOrder(root.right);
    }

    preOrder(root);

    return minimumNode;
}
function recoverTree(root: TreeNode | null): void {
    if (root === null) return;

    const maximumLeft = getMaximum(root.left);
    const minimumRight = getMinimum(root.right);

    if (maximumLeft && minimumRight) {
        if (root.val < maximumLeft.val && root.val > minimumRight.val) {
            const temp = minimumRight.val;
            minimumRight.val = maximumLeft.val;
            maximumLeft.val = temp;
            return;
        } 
    }

    if (maximumLeft) {
        if (root.val < maximumLeft.val) {
            // change
            const temp = maximumLeft.val;
            maximumLeft.val = root.val;
            root.val = temp;
            return;
        }
    }

    if (minimumRight) {
        if (root.val > minimumRight.val) {
            // channge
            const temp = minimumRight.val;
            minimumRight.val = root.val;
            root.val = temp;
            return;
        }
    }

    recoverTree(root.left);
    recoverTree(root.right);
};
```

### 扁平二叉搜索树

```javascript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function increasingBST(root: TreeNode | null): TreeNode | null {
    if (root === null) return null;

    const left = increasingBST(root.left);
    const right = increasingBST(root.right);

    if (left === null) {
        root.right = right;
        root.left = null;
        return root;
    }

    let temp = left;

    while(temp.right) {
        temp = temp.right;
    }

    temp.right = root;
    root.left = null;
    root.right = right;

    return left;
};
```

