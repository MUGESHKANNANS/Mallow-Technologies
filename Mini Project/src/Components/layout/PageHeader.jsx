import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const PageHeader = ({ title, extra }) => {
    return (
        <div
            style={{
                background: "#fff",
                padding: "16px 24px",
                borderRadius: 8,
                marginBottom: 24,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div>
                <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    {title}
                </Title>
            </div>
            {extra && <div>{extra}</div>}
        </div>
    );
};

export default PageHeader;
