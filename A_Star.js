class AStarNode {
    constructor(id, x, y, isHinder) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.gCost = Infinity;
        this.hCost = 0;
        this.fCost = 0;
        this.parent = null;
        this.isHinder = isHinder;
    }

    equals(node) {
        return this.id === node.id;
    }
}

function AStar(map, start, goal) {
    const openList = [];
    const closedList = new Set();

    start.gCost = 0;
    start.hCost = heuristic(start, goal);
    start.fCost = start.gCost + start.hCost;
    start.parent = null;

    openList.push(start);

    while (openList.length > 0) {
        // Use shift to make this array a queue
        const current = openList.shift();

        // build path if it is current node is goal node
        if (current.equals(goal)) return reconstructPath(current);

        if (
            Array.from(closedList).filter((node) => node.id === current.id)
                .length > 0
        )
            continue;

        // if not mark as explored
        closedList.add(current);

        for (const neighbour of getNeighbours(map, current)) {
            if (
                Array.from(closedList).filter(
                    (node) => node.id === neighbour.id
                ).length > 0
            ) {
                continue;
            }

            const tentativeGCost = current.gCost + distance(current, neighbour);
            if (
                !openList.includes(neighbour) ||
                tentativeGCost < neighbour.gCost
            ) {
                neighbour.parent = current;
                neighbour.gCost = tentativeGCost;
                neighbour.hCost = heuristic(neighbour, goal);
                neighbour.fCost = neighbour.gCost + neighbour.hCost;

                if (!openList.includes(neighbour)) {
                    openList.push(neighbour);
                    openList.sort((a, b) => a.fCost - b.fCost);
                }
            }
        }
    }

    return null;
}

// reconstructPath
function reconstructPath(node) {
    const path = [];
    while (node !== null) {
        path.unshift(node);
        node = node.parent;
    }

    return path;
}

// getNeighbours
// map:
// [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9]
// ]

// VERIFIED correct
// 0 blank
// 1 hinder
// 2 source
// 3 destination
function getNeighbours(map, currentNode) {
    const colLength = map[0].length;
    const rowLength = map.length;
    let neighbours = [];
    let checkLeft = false;
    let checkRight = false;
    let checkTop = false;
    let checkBottom = false;

    // if pos at 0, no left check needed
    if (currentNode.x !== 0 && map[currentNode.y][currentNode.x - 1] !== 1)
        checkLeft = true;

    // if pos at the end, no right check needed
    if (
        currentNode.x !== colLength - 1 &&
        map[currentNode.y][currentNode.x + 1] !== 1
    )
        checkRight = true;

    // if pos on top, no top check needed
    if (currentNode.y !== 0 && map[currentNode.y - 1][currentNode.x] !== 1)
        checkTop = true;

    // if pos on bottom, no bottom check needed
    if (
        currentNode.y !== rowLength - 1 &&
        map[currentNode.y + 1][currentNode.x] !== 1
    )
        checkBottom = true;

    // get left node
    if (checkLeft)
        neighbours.push(
            new AStarNode(
                currentNode.x - 1 + currentNode.y * colLength,
                currentNode.x - 1,
                currentNode.y,
                false
            )
        );

    // get right node
    if (checkRight)
        neighbours.push(
            new AStarNode(
                currentNode.x + 1 + currentNode.y * colLength,
                currentNode.x + 1,
                currentNode.y,
                false
            )
        );
    // get top node
    if (checkTop)
        neighbours.push(
            new AStarNode(
                currentNode.x + (currentNode.y - 1) * colLength,
                currentNode.x,
                currentNode.y - 1,
                false
            )
        );
    // get bottom node
    if (checkBottom)
        neighbours.push(
            new AStarNode(
                currentNode.x + (currentNode.y + 1) * colLength,
                currentNode.x,
                currentNode.y + 1,
                false
            )
        );

    return neighbours;
}

// distance

function distance(nodeA, nodeB) {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}
// heuristic
function heuristic(node, goal) {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
}

const sampleMap = [
    [0, 1, 0],
    [2, 0, 0],
    [0, 1, 3],
];

const iter = AStar(
    sampleMap,
    new AStarNode(3, 0, 1, false),
    new AStarNode(8, 2, 2, false)
);

function checkAndLogValue() {
    const result = iter.next();
    if (!result.done) {
        console.log(result.value);
        setTimeout(checkAndLogValue, 30); // Check again after 0.03 second
    }
}
