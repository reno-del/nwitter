import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachmentUrl !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
