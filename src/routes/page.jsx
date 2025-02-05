
import { Footer } from "@/layouts/footer";
import { useState, useEffect } from "react";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';

const { Meta } = Card;
import { getPost } from "@/api";
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
        <div className="grid md:grid-cols-1 grid-cols-1 place-items-center gap-2 mb-14">
      {postData.map((post, index) => (
        
        post.status===true||post.status==="active"||post.status==="Active"?(<Card
            key={post.id || index}
            style={{ width: "60%" }}
            
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
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
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${post.video.split("v=")[1] || post.video.split("/").pop()}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
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
