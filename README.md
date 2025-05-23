# 🥐 Croissant

## env type
重新生成 env types `npx wrangler types `

## db local
`npx wrangler d1 execute db_for_croissant --local  --file=./drizzle/migrations/0000_light_wendell_vaughn.sql`

## `RESTful API`
在 `RESTful API` 中，`PATCH` 和 `PUT` 都是用于更新资源的 `HTTP` 方法，但它们之间存在一些区别：
### 更新方式
`PUT` ：通常用于更新整个资源。它要求客户端发送一个完整的更新后的资源表示，替换服务器上原有的资源。例如，如果有一个用户资源，包括姓名、年龄、邮箱等字段，使用 `PUT` 方法更新时，需要提供所有字段的完整数据，即使有些字段的值没有改变。这意味着客户端需要先获取资源的最新版本，然后对需要更新的部分进行修改后再进行 `PUT` 请求，否则可能会导致数据丢失。比如，用户只想要更新名字，但用 `PUT` 发送数据时，没有包含年龄和邮箱字段，那么服务器在更新后，年龄和邮箱字段可能会被清空或者设置为默认值，这显然不是期望的结果。
`PATCH` ：用于对资源进行部分更新。客户端只需发送需要修改的字段及其新值，服务器会根据这些信息来更新资源中对应的字段，而不会影响其他字段的内容。以上述用户资源为例，如果只想更新姓名，使用 `PATCH` 方法就可以只发送姓名字段的新数据，而年龄和邮箱字段保持不变。
### 幂等性
`PUT` ：是幂等的。所谓幂等，是指多次相同的请求会产生与一次请求相同的效果。对于 `PUT` 来说，无论发送多少次相同的 `PUT` 请求，资源的最终状态都是相同的。例如，将某个资源的值设置为 100，连续发送三次 `PUT` 请求，最后一次请求完成后的资源值仍然是 100，前两次请求不会对结果产生额外的影响。
`PATCH` ：不一定是幂等的。这取决于具体的实现。如果 `PATCH` 请求是用于对资源进行增量式的更新，并且每次更新都是基于上次更新后的状态，那么多次相同的 `PATCH` 请求可能会导致不同的结果。比如，一个 `PATCH` 请求是将某个计数器加 1，连续发送三次这个请求，计数器的值会增加 3，而不是保持原来的值加 1。不过，也可以设计幂等的 `PATCH` 请求，例如提供一个唯一的请求标识，服务器根据这个标识来确保多次请求只执行一次更新操作。
### 适用场景
`PUT` ：适用于需要对整个资源进行更新的场景。当客户端知道资源的完整状态，并且希望将其替换为新的完整状态时，`PUT` 是合适的选择。例如，在上传一个完整的文件到服务器来替换旧文件时，使用 `PUT` 方法比较合适，因为它能确保文件的全部内容被更新。
`PATCH` ：适用于只需要对资源进行小范围修改的场景。当客户端只需要更新资源的某些特定字段，而不希望影响其他字段时，`PATCH` 更加高效。比如，修改用户资料中的个人简介或者头像等部分信息，使用 `PATCH` 方法可以减少数据传输量和服务器处理的复杂度。

