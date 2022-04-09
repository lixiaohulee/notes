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


### 快速排序

快速排序的最坏情况是O(n2)  最好情况是O(nlogn) 平均复杂度是O(nlogn)

算法在时间渐近曲线一样的情况下。就可以考虑算法的基本常量操作的复杂度了 

```javascript
function sortArray(nums: number[]): number[] {
    quickSort(nums, 0, nums.length-1);
    return nums;
};


const quickSort = (nums: number[], left: number, right: number) => {
    if (left >= right) return;

    let _left = left;
    let _right = right;

    const pivot = nums[_left];

    while (_left < _right) {
        while(_left < _right &&  nums[_right] >= pivot) {
            _right--;
        }
        nums[_left] = nums[_right];

        while(_left < _right && nums[_left] <= pivot ) {
            _left++;
        } 
        nums[_right] = nums[_left];
    }

    nums[_left] = pivot;
    quickSort(nums, left, _left-1);
    quickSort(nums, _left+1, right);
    
}
```

### 二叉树的锯齿形层序遍历

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

function zigzagLevelOrder(root: TreeNode | null): number[][] {
    if (root === null) return [];

    const res = [];

    const queue = [];
    queue.push(root);

    let isEvenLevel = false;

    while(queue.length) {
        const len = queue.length;

        const temp = []; 
        for(let i = 0; i < len; i++) {
            const node = queue.shift();

            isEvenLevel ? temp.unshift(node.val) : temp.push(node.val);

            if (node.left) {
                queue.push(node.left);
            }

            if (node.right) {
                queue.push(node.right);
            }
        }

        isEvenLevel = !isEvenLevel;
        res.push(temp);
    }

    return res;
};
```

### 路径和

```javascript
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
    const res = [];

    const helper = (root: TreeNode | null, path: string, sum: number) => {
        if (root === null) return;

        if (root.left === null && root.right === null) {
            sum += root.val;
            if (sum === targetSum) {
                path += root.val;
                res.push(path.split(','));
            }
            return;
        }

        helper(root.left, path+root.val+',', sum+root.val);
        helper(root.right, path+root.val+',', sum+root.val);
    } 
     
    helper(root, '', 0);

    return res;
};
```


### 有序链表转换二叉搜索树

```javascript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

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

const listToArray = (head: ListNode | null): number[] => {
    if (head === null) return [];

    const nums = [];

    let temp = head;
    while(temp) {
        nums.push(temp.val);
        temp = temp.next;
    }

    return nums;
}

function sortedListToBST(head: ListNode | null): TreeNode | null {
    if (head === null) return null;

    const nums = listToArray(head);

    const buildBST = (nums: number[]): TreeNode | null => {
        if (nums.length === 0) return null;

        const mid = Math.floor((nums.length-1) / 2);

        const root = new TreeNode(nums[mid]);

        root.left = buildBST(nums.slice(0, mid));
        root.right = buildBST(nums.slice(mid+1));

        return root; 
    }

    return buildBST(nums);
};
```

```javascript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

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

const getMiddleNode = (left: ListNode, right: ListNode | null): ListNode | null => {
    
    // 快慢指针法找出中间节点 原理是fast走两步 slow走一步 那么fast就是slow的2倍 
    // 等到fast走完整个链表时 那么slow一定是才走了链表的一半 那么slow就是中间节点了 (注意奇数个和偶数个)
    let fast = left;
    let slow = left;

    // 如果fast === null 那么有偶数个节点
    // 如果fast.next === null 那么有奇数个节点
    while(fast !== right && fast.next !== right) {
        fast = fast.next;
        fast = fast.next;
        slow = slow.next;
    }

    return slow;
}

function sortedListToBST(head: ListNode | null): TreeNode | null {
    if (head === null) return null;

    const buildBST = (left: ListNode | null, right: ListNode | null): TreeNode | null => {
        if (left === right) return null;

        const middleNode = getMiddleNode(left, right);

        const root = new TreeNode(middleNode.val);

        root.left = buildBST(left, middleNode);
        root.right = buildBST(middleNode.next, right);

        return root; 
    }

    return buildBST(head, null);
};
```


### 完全二叉树的遍历

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

function countNodes(root: TreeNode | null): number {
    let lHeight = 0; 
    let rHeight = 0;

    let l = root;
    let r = root;

    while(l) {
        lHeight++;
        l = l.left;
    }

    while(r) {
        rHeight++;
        r = r.right;
    }

    if (lHeight === rHeight) {
        return Math.pow(2, lHeight) -1;
    }

    return 1 + countNodes(root.left) + countNodes(root.right);
};
```

### BST 转累加树

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

function convertBST(root: TreeNode | null): TreeNode | null {
    let sum = 0;

    const traverse = (root: TreeNode | null) : TreeNode | null => {
        if (root === null) return null;

        traverse(root.right);
        
        sum += root.val;
        root.val = sum;

        traverse(root.left);

        return root;
    }


    return traverse(root);
};
```

### 验证BST

```javascript
/*
 * @lc app=leetcode.cn id=98 lang=typescript
 *
 * [98] 验证二叉搜索树
 */

// @lc code=start
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

function isValidBST(root: TreeNode | null): boolean {
  let preNodeVal = Number.MIN_SAFE_INTEGER;
  let isValid = true;

  const traverse = (root: TreeNode | null): void => {
    if (root === null) return;

    traverse(root.left);
    if (root.val <= preNodeVal) {
      isValid = false;
      return;
    } 
    preNodeVal = root.val;
    traverse(root.right);
  }

  traverse(root);

  return isValid;
};
```



```javascript
function isValidBST(root: TreeNode | null): boolean {
    const helper = (
    root: TreeNode | null,
    min: TreeNode | null,
    max: TreeNode | null
  ) => {
    if (root === null) return true;

    if (min && root.val >= min.val) return false;
    if (max && root.val <= max.val) return false;

    return helper(root.left, root, max) && helper(root.right, min, root);
  };

  return helper(root, null, null);
};
```

### BST 搜索 利用BST性质 二分

```javascript
function searchBST(root: TreeNode | null, val: number): TreeNode | null {
    if (root === null) return null;
    if (root.val === val) return root;
    if (val < root.val) return searchBST(root.left, val);
    return searchBST(root.right, val);
};
```


### BST 插入数值

```javascript
function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {

    if (root === null) return new TreeNode(val);

    const helper = (root: TreeNode | null, val: number): void => {
        if (root === null) return;

        if (val < root.val) {
            if (root.left === null) {
                root.left = new TreeNode(val);
            } else {
                helper(root.left, val);
            }
        }

        if (val > root.val) {
            if (root.right === null) {
                root.right = new TreeNode(val);
            } else {
                helper(root.right, val);
            }
        }
    };

    helper(root, val);

    return root;

};
```


### BST 删除值

```javascript
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    const helper = (root: TreeNode | null, key: number): TreeNode | null => {
        if (root === null) return null;

        if (root.val === key) {
            let left = root.left;
            let right = root.right;

            root = null;

            if (right === null) return left;

            let temp = right;
            while (temp.left) {
                temp = temp.left;
            }
            temp.left = left;

            return right;
        }

        if (key < root.val) {
            root.left = helper(root.left, key);
        }

        if (key > root.val) {
            root.right = helper(root.right, key);
        }

        return root;
    };

  return helper(root, key);

};
```

### 不同的二叉搜索树

```javascript
function numTrees(n: number): number {

    const getBSTNums = (n: number): number => {
        if (n === 0 || n == 1) return 1;

        let sum = 0;

        let i = 1;
        while(i <= n) {
            let left = i - 1;
            let right = n - i

            const bstNumsFromLeft = getBSTNums(left);
            const bstNumsFromRight = getBSTNums(right);

            sum += bstNumsFromLeft * bstNumsFromRight;
            i++;
        }
        
        return sum;
    }


    return getBSTNums(n);
};
```

```javascript
function numTrees(n: number): number {
    
    const cache = new Map();
    const getBSTNums = (n: number): number => {
        if (cache.get(n)) {
            return cache.get(n);
        }

        if (n === 0 || n == 1) return 1;

        let sum = 0;

        let i = 1;
        while(i <= n) {
            let left = i - 1;
            let right = n - i

            const bstNumsFromLeft = getBSTNums(left);
            const bstNumsFromRight = getBSTNums(right);

            sum += bstNumsFromLeft * bstNumsFromRight;
            i++;
        }

        cache.set(n, sum);

        return sum;
    }


    return getBSTNums(n);
};
```


### 不同的BST II

```javascript
function generateTrees(n: number): Array<TreeNode | null> {
    const generateHelper = (low: number, high: number) => {
        if (low > high) return [null];

       // 为什么在这里必须得用low high 而不是上面的直接是数字呢 因为上面只是计算数量 所以不在乎具体的值是多少的 但是这里需要构建真正的树 所以是跟值相关的 那么就不能用上面的方式了
        const res = [];

        for (let i = low; i <= high; i++) {
            const leftSubTreeArr = generateHelper(low, i - 1);
            const rightSubTreeArr = generateHelper(i + 1, high);

        // 这里其实就是个对左子树类型和右子树的类型做的排列组合
        for (let j = 0; j < leftSubTreeArr.length; j++) {
            for (let k = 0; k < rightSubTreeArr.length; k++) {
                const root = new TreeNode(i);

                root.left = leftSubTreeArr[j];
                root.right = rightSubTreeArr[k];

                // 到这里 算是构建完了一颗真正的二叉搜索子树
                res.push(root);
            }
        }
        }

        return res;
    };

    return generateHelper(1, n);
};
```

### 翻转二叉树以匹配先序遍历

```javascript
function flipMatchVoyage(root: TreeNode | null, voyage: number[]): number[] {
    let res = [];

    let i = 0;

    const helper = (root: TreeNode | null, parentNode: TreeNode | null) => {
        if (root === null || res.includes(-1)) return;

            if (root.val === voyage[i]) {
                i++;
                } else if (
                    parentNode &&
                    parentNode.right &&
                    parentNode.right.val === voyage[i]
                    ) {
                    i++;
                    const temp = root;
                    root = parentNode.right;
                    parentNode.right = temp;

                    res.push(parentNode.val);
                } else {
                res = [-1];
            }

        helper(root.left, root);
        helper(root.right, root);
    };

    helper(root, null);

    return res;
};
```

### 在二叉树中增加一行

```javascript
function addOneRow(root: TreeNode | null, val: number, depth: number): TreeNode | null {
    let newRoot = root;
    const helper = (root: TreeNode | null, curDepth: number) => {
        if (root === null) return;

        if (depth-1 === 0) {
            const node = new TreeNode(val);
            node.left = root;
            newRoot = node;
            return;
        } 

        if (curDepth === depth-1) {
            const left = root.left;
            const right = root.right;

            const node1 = new TreeNode(val);
            const node2 = new TreeNode(val);

            root.left = node1;
            root.right = node2;

            node1.left = left;
            node2.right = right;


            return;
        }

        helper(root.left, curDepth+1);
        helper(root.right, curDepth+1);
    }

    helper(root, 1);

    return newRoot;
};
```

```javascript
function addOneRow(root: TreeNode | null, val: number, depth: number): TreeNode | null {
    if (root === null) return null;

    if (depth === 1) {
        const node = new TreeNode(val);
        node.left = root;

        return node;
    }

    if (depth === 2) {
        const left = root.left;
        const right = root.right;

        const node1 = new TreeNode(val);
        const node2 = new TreeNode(val);

        root.left = node1;
        root.right = node2;

        node1.left = left;
        node2.right = right;

        return root;
    }

    root.left = addOneRow(root.left, val, depth - 1);
    root.right = addOneRow(root.right, val, depth - 1);

    return root;
};
```

### 二叉树最大宽度

```
interface MyNode {
    node: TreeNode,
    position: bigint,
}

function widthOfBinaryTree(root: TreeNode | null): bigint {
    if (root === null) return BigInt(0);

    const res: MyNode[][] = [];

    const queue: MyNode[] = [];

    queue.push({
        node: root,
        position: 1n,
    });

    while(queue.length) {
        const length = queue.length;

        const level: MyNode[] = [];

        for(let i = 0; i < length; i++) {
            const { node, position } = queue.shift();
            
            level.push({
                node,
                position, 
            });

            if (node.left) {
                queue.push({
                    node: node.left,
                    position: position * 2n
                });
            }

            if (node.right) {
                queue.push({
                    node: node.right,
                    position: position * 2n + 1n
                })
            }
        }
        res.push(level);
    }

    let max = BigInt(Number.MIN_SAFE_INTEGER);
    
    for (let j = 0; j < res.length; j++) {
        const level = res[j];

        const length = level.length;

        const low = level[0];
        const high = level[length-1];

        const curLevelWidth = high.position - low.position + 1n;

        max = max > curLevelWidth ? max : curLevelWidth;
    }

    return max;
};
```


```
interface MyNode {
  node: TreeNode;
  position: bigint;
}
function widthOfBinaryTree(root: TreeNode | null): bigint {
  if (root === null) return 0n;

  const queue = [];

  queue.push({
    node: root,
    position: 1n,
  });

  let maxWidth = 0n;

  while (queue.length) {
    const length = queue.length;

    const level = [];
    for (let i = 0; i < length; i++) {
      const { node, position } = queue.shift();

      level.push({
        node,
        position,
      });

      if (node.left) {
        queue.push({
          node: node.left,
          position: position * 2n,
        });
      }

      if (node.right) {
        queue.push({
          node: node.right,
          position: position * 2n + 1n,
        });
      }
    }

    const low = level[0];
    const high = level[level.length - 1];

    const currentLevelWidth = BigInt(high.position - low.position) + 1n;

    maxWidth = maxWidth > currentLevelWidth ? maxWidth : currentLevelWidth;
  }

  return maxWidth;
}
```


### 二叉树的最大直径

```javascript
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = Number.MIN_SAFE_INTEGER;

  const traverse = (root: TreeNode | null): number => {
    if (root === null) return 0;

    const leftDepth = traverse(root.left);
    const rightDepth = traverse(root.right);

    const leftDiameter = leftDepth - 1;
    const rightDiameter = rightDepth - 1;

    const curMaxDiameter = leftDiameter + rightDiameter + 2;

    maxDiameter = maxDiameter > curMaxDiameter ? maxDiameter : curMaxDiameter;

    return 1 + Math.max(leftDepth, rightDepth);
  };

  traverse(root);

  return maxDiameter;
}
```


### 出现最多的子元素树和

```javascript
function findFrequentTreeSum(root: TreeNode | null): number[] {
  const sumMap = new Map<number, number>();

  const traverse = (root: TreeNode | null): number => {
    if (root === null) return 0;

    const leftSum = traverse(root.left);
    const rightSum = traverse(root.right);

    const currentSum = root.val + leftSum + rightSum;

    if (sumMap.has(currentSum)) {
      const count = sumMap.get(currentSum);
      sumMap.set(currentSum, count + 1);
    } else {
      sumMap.set(currentSum, 0);
    }

    return currentSum;
  };

  traverse(root);

  let maxSumCount = Number.MIN_SAFE_INTEGER;

  let res = [];
  for (let [sum, count] of sumMap.entries()) {
    if (count > maxSumCount) {
      res = [sum];
      maxSumCount = count;
    } else if (count === maxSumCount) {
      res.push(sum);
    }
  }

  return res;
}
```

### 修剪二叉搜索树

```javascript
function trimBST(
  root: TreeNode | null,
  low: number,
  high: number
): TreeNode | null {
  if (root === null) return null;

  const left = trimBST(root.left, low, high);
  const right = trimBST(root.right, low, high);

  if (root.val >= low && root.val <= high) {
    root.left = left;
    root.right = right;

    return root;
  }

  if (right === null) {
    root = null;
    return left;
  }

  let temp = right;

  while (temp.left) {
    temp = temp.left;
  }
  temp.left = left;

  root = null;
  return right;
}
```


### 二叉树剪枝

```javascript
function pruneTree(root: TreeNode | null): TreeNode | null {
  const trimHelper = (root: TreeNode | null): [TreeNode | null, boolean] => {
    if (root === null) return [null, true];

    let [left, leftNeedTrimming] = trimHelper(root.left);
    let [right, rightNeedTrimming] = trimHelper(root.right);

    if (leftNeedTrimming && rightNeedTrimming) {
      if (root.val === 0) {
        return [null, true];
      } else {
        root.left = left;
        root.right = right;
        return [root, false];
      }
    }

    root.left = left;
    root.right = right;
    return [root, false];
  };

  return trimHelper(root)[0];
}
```

```javascript
function pruneTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;

  const left = pruneTree(root.left);
  const right = pruneTree(root.right);

  if (left === null && right === null && root.val === 0) {
    return null;
  }

  root.left = left;
  root.right = right;

  return root;
}
```


### 相似叶子

数组比字符串拼接快


```typescript
function leafSimilar(root1: TreeNode | null, root2: TreeNode | null): boolean {
  const leaf1 = [];
  const leaf2 = [];

  const traverse = (root: TreeNode | null, leaf: number[]): string => {
    if (root === null) return;

    traverse(root.left, leaf);
    traverse(root.right, leaf);

    if (root.left === null && root.right === null) {
      leaf.push(root.val);
    }
  };

  traverse(root1, leaf1);
  traverse(root2, leaf2);

  if (leaf1.length !== leaf2.length) return false;

  for (let i = 0; i < leaf1.length; i++) {
    if (leaf1[i] !== leaf2[i]) {
      return false;
    }
  }

  return true;
}
```



```kotlin
function leafSimilar(root1: TreeNode | null, root2: TreeNode | null): boolean {

  const traverse = (root: TreeNode | null, leaf: string): string => {
    if (root === null) return "";

    const leaf1 = traverse(root.left, leaf);
    const leaf2 = traverse(root.right, leaf);

    if (root.left === null && root.right === null) {
      return leaf1 + leaf2 + root.val + ",";
    }

    return leaf1 + leaf2;
  };

  return traverse(root1, "") === traverse(root2, "");
}
```


### 两数之和 BST

```javascript
function findTarget(root: TreeNode | null, k: number): boolean {
  const set = new Set<number>();

  const traverse = (root: TreeNode | null): boolean => {
    if (root === null) return false;

    if (set.has(k - root.val)) {
      return true;
    }

    set.add(root.val);

    return traverse(root.left) || traverse(root.right);
  };

  return traverse(root);
}
```

### 根据二叉树前序和后序遍历还原二叉树

```javascript
function constructFromPrePost(
  preorder: number[],
  postorder: number[]
): TreeNode | null {
  const length = preorder.length;

  if (length === 0) return null;
  if (length === 1) {
    return new TreeNode(preorder[0]);
  }

  const leftSubTreeRootVal = preorder[1];

  let leftSubTreeRootValIndexOfPostOrder = -1;

  for (let i = 0; i < length; i++) {
    if (postorder[i] === leftSubTreeRootVal) {
      leftSubTreeRootValIndexOfPostOrder = i;
      break;
    }
  }

  const leftSubTreeNodeCount = leftSubTreeRootValIndexOfPostOrder + 1;

  const root = new TreeNode(preorder[0]);

  root.left = constructFromPrePost(
    preorder.slice(1, leftSubTreeNodeCount + 1),
    postorder.slice(0, leftSubTreeNodeCount)
  );
  root.right = constructFromPrePost(
    preorder.slice(leftSubTreeNodeCount + 1),
    postorder.slice(leftSubTreeNodeCount, length - 1)
  );

  return root;
}
```
### 二叉树的堂兄弟

```javascript


interface TargetNodeInfo {
  depth: number;
  parent: TreeNode | null;
}

function isCousins(root: TreeNode | null, x: number, y: number): boolean {
  let xInfo: TargetNodeInfo;
  let yInfo: TargetNodeInfo;

  const traverse = (
    root: TreeNode | null,
    parent: TreeNode | null,
    depth: number
  ): void => {
    if (root === null) return;

    if (xInfo && yInfo) return;

    if (root.val === x) {
      xInfo = {
        depth,
        parent,
      };
    }

    if (root.val === y) {
      yInfo = {
        depth,
        parent,
      };
    }

    traverse(root.left, root, depth + 1);
    traverse(root.right, root, depth + 1);
  };

  traverse(root, null, 0);

  if (xInfo.depth === yInfo.depth && xInfo.parent.val !== yInfo.parent.val) {
    return true;
  }

  return false;
}

```

### 两数之和

```javascript
function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const another = target - nums[i];
        if (map.has(another)) {
            const anotherIndex = map.get(another);
            return [anotherIndex, i];
        }

        map.set(nums[i], i);
    }

    return [-1, -1];
};
```

