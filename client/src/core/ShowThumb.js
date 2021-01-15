import React from "react";
import { API } from "../config";

const ShowThumb = ({ item, url }) => (
    <div className="product-img">
        <img
            src={`${API}/${url}/photo/${item._id}`}
            alt={item.name}
            className=""
            style={{ maxHeight: "130%", maxWidth: "140%" }}
        />
    </div>
);

export default ShowThumb;