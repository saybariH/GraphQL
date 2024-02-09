import React, {useState} from "react";
import { useMutation, gql  } from "@apollo/client";
import { useNavigate} from 'react-router-dom';
import { FEED_QUERY } from "./LinksList";
const CREATE_LINK_MUTATION = gql `
mutation PostMutation(
    $description: String!
    $url: String!
){
    post(description: $description, url: $url){
        id 
        createdAt
        url
        description 

    }
}`;
 const CreateLink = () =>{
    const navigate = useNavigate();
    const [fromState, setFormState] = useState({
        description:'',
        url:''
    });
    const [createLink] = useMutation(CREATE_LINK_MUTATION,{
        variables: {
            description: fromState.description,
            url: fromState.url
        },
        update: (cache, { data : {post}}) => {
            const data = cache.readQuery({
                query: FEED_QUERY
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data:{
                    feed:{
                        links: [post, ...data.feed.links]
                    }
                }
            });
        },
        onCompleted: () => navigate('/')
        
    });
 
    return (
        <div>
            <form onSubmit={(e)=> {
                e.preventDefault();
                createLink();
                
            }}>
                <div className="flex flex-column mt3">
                    <input className="mb2" 
                    value={fromState.description} 
                    onChange={(e) => 
                        setFormState({
                        ...fromState, description: e.target.value
                    })} 
                    type="text" 
                    placeholder="A description for the link " />
                
                    <input className="mb2" 
                    value={fromState.url} 
                    onChange={(e) => 
                        setFormState({
                        ...fromState, url: e.target.value
                    })} 
                    type="text" 
                    placeholder="The URL form the link " />
                </div>
                <button type="submit">Submit</button>

            </form>
        </div>
    );
 };
 export default CreateLink;