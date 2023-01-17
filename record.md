```typescript
function divisorGame(n: number): boolean {
    //确定状态 由于游戏中爱丽丝和鲍勃轮流着来 所以我们这里记录的时候不再区分人 统一记dp[i]表示第i步选择后n的值
    //状态转移方程 dp[i] = n - for循环1到n-1中的第一个满足n % x == 0的数 找到这样数就停止 (这就是他们各自的最佳状态下做出的选择)
    //初始值和边界情况 dp[0] = n 刚开始爱丽丝还没有做选择 那么就是n
    //计算顺序 数字从小到大遍历 正常的人最好的状态应该是先想到拿小的值去整除n 这样容易计算啊 


    const dp = Array(n);

    dp[0] = n;

    for (let i = 1; i < n; i++) {
        dp[i] = -1; // 给个默认值 
        const pre = dp[i-1];
        for (let j = 1; j < pre; j++) {
            if (pre % j === 0) {
                dp[i] = pre - j;
                break;
            }
        }
    }

    const lastStep = dp.length - 1;

    return lastStep % 2 !== 0 ? true : false;
};
```


```typescript

function getMaximumGenerated(n: number): number {
    const dp = Array(n+1);

    for (let i = 0; i < n + 1; i++) {
        if (i <= 1) {
            dp[i] = i;
            continue;
        }

        if (i % 2 === 0) {
            dp[i] = dp[i / 2];
        } else {
            dp[i] = dp[(i - 1) / 2] + dp[(i -1 ) / 2 + 1];
        }
    }


    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < n + 1; i++) {
        max = Math.max(max, dp[i]);
    }

    return max;
};

// 减少一个循环
function getMaximumGenerated(n: number): number {
    const dp = Array(n+1);

    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < n + 1; i++) {
        if (i <= 1) {
            dp[i] = i;
            continue;
        }

        if (i % 2 === 0) {
            dp[i] = dp[i / 2];
        } else {
            dp[i] = dp[(i - 1) / 2] + dp[(i -1 ) / 2 + 1];
        }

        max = Math.max(max, dp[i]);
    }

    return max === Number.MIN_SAFE_INTEGER ? dp[dp.length-1] : max;
};
```
