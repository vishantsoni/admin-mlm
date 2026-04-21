import React, { useState } from 'react';
import '@/components/admin/GenologyTree/GenealogyTree.css';
import { EyeIcon } from '@/icons';

interface Member {
  id: number;
  username: string;
  email: string;
  phone: string;
  node_path: string;
  referrer_id: number;
  referral_code: string;
  created_at: string;
  is_active:boolean;
  kyc_status:boolean;
  children: Member[];
}

interface TreeNodeProps {
  member: Member;
  onSelect: (member: Member) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ member, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    
  };

  const hasChildren = member.children && member.children.length > 0;



  return (
    <li className='bg-warning'>
      <a href="#" >
        <div className={`member-view-box ${ member.kyc_status ? member.is_active ? 'bg-gray-200 dark:bg-gray-500':'bg-warning-300 dark:bg-warning-300' : 'bg-error-300 dark:bg-error-300' }`} onClick={toggleOpen}>
          <div className="member-header">
            <span>{member.phone}</span>
          </div>
          <div className="member-image" onClick={toggleOpen}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
              alt={member.username}
            />
          </div>
          <div className="member-footer">
            <div className="name"><span>{member.username}</span></div>
            <div className="downline">
              <span>{member.referral_code}</span>
              <span onClick={()=>onSelect(member)}><EyeIcon className="mx-auto" /></span>
            </div>



          </div>
        </div>
      </a>

      {hasChildren && isOpen && (
        <ul className="active">
          {member.children.map((child) => (
            <TreeNode key={child.id} member={child} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
};

const GenealogyTree: React.FC<{ data: Member[], onSelect: (member: Member) => void }> = ({ data, onSelect }) => {
  return (
    <div className="genealogy-body genealogy-scroll bg-gray-100 dark:bg-gray-800 ">
      <div className="genealogy-tree">
        <ul>
          {data.map((rootMember) => (
            <TreeNode key={rootMember.id} member={rootMember} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenealogyTree;