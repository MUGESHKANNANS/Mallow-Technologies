import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

const Search = ({ onSearch, placeholder = "Search", style, ...props }) => {
    const handleSearch = debounce((e) => {
        onSearch(e.target.value);
    }, 500);

    return (
        <Input
            placeholder={placeholder}
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            onChange={handleSearch}
            style={{ width: "100%", borderRadius: 6, marginBottom: 20, ...style }}
            size={props.size || "large"}
            {...props}
        />
    );
};

export default Search;
