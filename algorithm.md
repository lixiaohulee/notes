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


```

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

