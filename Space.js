const SpaceType = {
    Blank: {
        id: 1,
        color: "#ffffff",
    },
    Hinder: {
        id: 2,
        color: "rgb(220 38 38)",
    },
    Source: {
        id: 3,
        color: "rgb(22 163 74)",
    },
    Destination: {
        id: 4,
        color: "rgb(37 99 235)",
    },
    Path: {
        id: 5,
        color: "rgb(152 251 152)",
    },
};

class Space {
    constructor(spaceId, type) {
        this.id = spaceId;
        this.typeId = type.id;
        this.color = type.color;
    }

    getHTMLNode() {
        const node = document.createElement("div");
        node.classList.add(
            "h-full",
            "w-full",
            "col-span-1",
            "row-span-1",
            "hover:cursor-pointer",
            "hover:opacity-40",
            "space-node",
            "rounded-sm"
        );
        node.style.cssText = `background-color: ${this.color}`;
        node.setAttribute("data-id", this.id);
        node.setAttribute("data-typeId", this.typeId);

        return node;
    }

    static getSpaceByTypeId(typeId, nodeId) {
        switch (typeId) {
            case SpaceType.Blank.id:
                return new Space(nodeId, SpaceType.Blank);
            case SpaceType.Hinder.id:
                return new Space(nodeId, SpaceType.Hinder);
            case SpaceType.Source.id:
                return new Space(nodeId, SpaceType.Source);
            case SpaceType.Destination.id:
                return new Space(nodeId, SpaceType.Destination);
            case SpaceType.Path.id:
                return new Space(nodeId, SpaceType.Path);
        }
    }
}
