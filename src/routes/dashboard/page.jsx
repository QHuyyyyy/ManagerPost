import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;
import { getPost } from "../../api";
const DashboardPage = () => {
    const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const data = await getPost();
        setPostData(data);
      } 
      catch (err) {
        setError(err.message || "Failed to fetch posts");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-y-4">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-2 mb-14">
      {postData.map((post, index) => (
        <Card
          key={post.id || index}
          style={{ width: "100%" }}
          cover={
            <img
              alt={post.title || "Post Image"}
              src={post.image || "https://via.placeholder.com/300"}
            />
          }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />} // Example avatar
            title={post.title || "Untitled Post"}
            description={post.description|| "No description available"}
          />
        </Card>
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
