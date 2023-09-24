import Moment from "react-moment";
import { Link } from "react-router-dom";
import { FaTrash} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
export default function DisplayBlog({ blog, id, onEdit, onDelete }) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[5px]">
      <Link className="contents" to={`/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={blog.imgUrls[0]}
        />
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {blog.timestamp?.toDate()}
        </Moment>

        <p className="font-semibold m-0 text-l truncate">{blog.title}</p>

        <br />
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(blog.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(blog.id)}
        />
      )}
    </li>
  );
}
