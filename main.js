// Const Value
const EMPTY = "";

const BOARD_HEIGHT = 40;
const BOARD_WIDTH = 40;

const GRID_CONTAINER = document.getElementById("grid-container");

// Variables
let selectedSpaceType;
let currentDiv = null;
const mapHandler = new MapHandler(BOARD_HEIGHT * BOARD_WIDTH);
let map = mapHandler.getMap();
let sourceNodeIndex = { row: null, col: null };
let destinationNodeIndex = { row: null, col: null };
let readyToFindPath = false;
let isEditable = true;
let isFindingPath = false;
let isPathFound = false;

// functions
const refreshMap = (e, nodeId = null) => {
    // check if source and destination exists

    if (sourceNodeIndex.row != null && destinationNodeIndex.row != null)
        readyToFindPath = true;

    if (!nodeId) {
        GRID_CONTAINER.innerHTML = "";
        for (const row of map)
            for (const node of row) GRID_CONTAINER.appendChild(node);

        addNodeListener();
    } else {
        const newNode =
            map[parseInt(nodeId / BOARD_WIDTH)][parseInt(nodeId % BOARD_WIDTH)];
        newNode.addEventListener("click", handleNodeClick);

        GRID_CONTAINER.replaceChild(newNode, GRID_CONTAINER.childNodes[nodeId]);
    }

    // trigger once and close
    // until here map is completely refreshed
    if (readyToFindPath && !isFindingPath && !isPathFound) {
        readyToFindPath = false; // avoid repeatly triggered
        isEditable = false; // avoid further changes during finding path
        // [1] map with 0,1,2,3
        //      0 - blank
        //      1 - hinder
        //      2 - source
        //      3 - destination
        let targetMap = map;
        targetMap = targetMap.map((row) =>
            row.map(
                (htmlNode) => parseInt(htmlNode.getAttribute("data-typeId")) - 1
            )
        );

        // [2] start node
        const startNode = new AStarNode(
            sourceNodeIndex.row * BOARD_WIDTH + sourceNodeIndex.col,
            sourceNodeIndex.col,
            sourceNodeIndex.row,
            false
        );

        // [3] goal node
        const goalNode = new AStarNode(
            destinationNodeIndex.row * BOARD_WIDTH + destinationNodeIndex.col,
            destinationNodeIndex.col,
            destinationNodeIndex.row,
            false
        );

        // pass all data
        isFindingPath = true;
        findPath(targetMap, startNode, goalNode);
        console.log("Path is found");
        isFindingPath = false;
        isPathFound = true;
    }
};

const getBlankSpaceHTML = (nodeId) =>
    Space.getSpaceByTypeId(SpaceType.Blank.id, nodeId).getHTMLNode();

document.addEventListener("DOMContentLoaded", refreshMap);

const addNodeListener = () =>
    map.forEach((row) =>
        row.forEach((col) => col.addEventListener("click", handleNodeClick))
    );

const handleNodeClick = ({ target }) => {
    if (
        selectedSpaceType == null ||
        selectedSpaceType == undefined ||
        !isEditable
    )
        return;

    const clickedId = target.getAttribute("data-id");
    const indexRow = parseInt(clickedId / BOARD_WIDTH);
    const indexCol = parseInt(clickedId % BOARD_WIDTH);
    const isSource = selectedSpaceType === SpaceType.Source;
    const isDestination = selectedSpaceType === SpaceType.Destination;

    if (isSource || isDestination) {
        if (isSource) {
            if (sourceNodeIndex.row != null) {
                map[sourceNodeIndex.row][sourceNodeIndex.col] =
                    getBlankSpaceHTML(
                        sourceNodeIndex.row * BOARD_WIDTH + sourceNodeIndex.col
                    );
                refreshMap(
                    sourceNodeIndex.row * BOARD_WIDTH + sourceNodeIndex.col
                );
            }
            sourceNodeIndex.row = indexRow;
            sourceNodeIndex.col = indexCol;
        } else {
            if (destinationNodeIndex.row != null) {
                map[destinationNodeIndex.row][destinationNodeIndex.col] =
                    getBlankSpaceHTML(
                        destinationNodeIndex.row * BOARD_WIDTH +
                            destinationNodeIndex.col
                    );
                refreshMap(
                    destinationNodeIndex.row * BOARD_WIDTH +
                        destinationNodeIndex.col
                );
            }

            destinationNodeIndex.row = indexRow;
            destinationNodeIndex.col = indexCol;
        }
    }

    map[indexRow][indexCol] = Space.getSpaceByTypeId(
        selectedSpaceType.id,
        clickedId
    ).getHTMLNode();

    refreshMap(clickedId);
};

function changeCurrent(spaceType) {
    switch (spaceType) {
        case SpaceType.Blank.id:
            selectedSpaceType = SpaceType.Blank;
            break;

        case SpaceType.Hinder.id:
            selectedSpaceType = SpaceType.Hinder;
            break;

        case SpaceType.Source.id:
            selectedSpaceType = SpaceType.Source;
            break;

        case SpaceType.Destination.id:
            selectedSpaceType = SpaceType.Destination;
            break;
    }
    document.getElementById("colour-span").style.backgroundColor =
        selectedSpaceType.color;
}

// initialisation
refreshMap();

// Function to check if the left mouse button is held down
// 1 represents the left mouse button
function isLeftMouseDown(event) {
    return event.buttons === 1;
}

// Event listener for mousemove
document.addEventListener("mousemove", function (event) {
    if (isLeftMouseDown(event) && isEditable) {
        // Check which div the cursor is currently over
        let isFound = false;
        const divs = document.getElementsByClassName("space-node");
        for (const div of divs) {
            const rect = div.getBoundingClientRect();
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                // Cursor is over this div
                currentDiv = div;
                isFound = true;
                break;
            }
        }

        if (currentDiv == null || currentDiv == undefined || !isFound) return;

        // if hovered node is not the same as the selected spacetype
        const typeId = currentDiv.getAttribute("data-typeid");
        const nodeId = currentDiv.getAttribute("data-id");
        const row = parseInt(nodeId / BOARD_WIDTH);
        const col = parseInt(nodeId % BOARD_WIDTH);
        const isSource = selectedSpaceType === SpaceType.Source;
        const isDestination = selectedSpaceType === SpaceType.Destination;
        const isSourceAllowed = sourceNodeIndex.row == null;
        const isDestinationAllowed = destinationNodeIndex.row == null;

        if (selectedSpaceType.id != typeId) {
            if (isSource || isDestination) {
                if (isSource && isSourceAllowed) {
                    sourceNodeIndex.row = row;
                    sourceNodeIndex.col = col;
                } else if (isDestination && isDestinationAllowed) {
                    destinationNodeIndex.row = row;
                    destinationNodeIndex.col = col;
                } else {
                    return;
                }
            }

            const newNode = Space.getSpaceByTypeId(
                selectedSpaceType.id,
                nodeId
            ).getHTMLNode();

            newNode.addEventListener("click", handleNodeClick);
            map[row][col] = newNode;

            refreshMap(nodeId);
        }
    }
});

function findPath(targetMap, start, goal) {
    console.log("Finding Path");
    let node = AStar(targetMap, start, goal).map((node) => node.id);

    for (const id of node) {
        if (id !== start.id && id !== goal.id) {
            const r = parseInt(id / BOARD_WIDTH);
            const c = parseInt(id % BOARD_WIDTH);

            map[r][c] = Space.getSpaceByTypeId(
                SpaceType.Path.id,
                id
            ).getHTMLNode();
            refreshMap(id);
        }
    }

    isEditable = true;
}
