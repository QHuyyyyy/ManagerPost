import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useTheme } from "@/hooks/use-theme";

import { overviewData, recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";
import { useState, useEffect, useRef } from "react";
import { CreditCard, DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from "lucide-react";

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;
import { getPost } from "../../api";
const DashboardPage = () => {
    const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) { // Firefox
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { // IE/Edge
        videoRef.current.msRequestFullscreen();
      }
    }
  };
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
        <div className="grid md:grid-cols-1 grid-cols-1 place-items-center gap-2 mb-14">
      {postData.map((post, index) => (
        
        post.status==="Active"?(<Card
            key={post.id || index}
            style={{ width: "60%" }}
            
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />} // Example avatar
              title={post.title || "Untitled Post"}
              description={post.description|| "No description available"}
            />
            <img
                alt={post.title || "Post Image"}
                src={post.image || "https://via.placeholder.com/300"}
                style={{ width: "100%", marginTop: "10px" }}
              />
              {post.video && post.video.includes("youtube.com") || post.video.includes("youtu.be") ? (
          <iframe
            ref={videoRef}
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${post.video.split("v=")[1] || post.video.split("/").pop()}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            onClick={handleFullscreen}
            style={{ marginTop: "10px", borderRadius: "8px", cursor: "pointer" }}
          ></iframe>
        ) : null}
          </Card>):
          null
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
