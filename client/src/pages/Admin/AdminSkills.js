import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { ShowLoading, HideLoading } from "../../redux/rootSlice";

function AdminSkill() {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector((state) => state.root);
  const [skills, setSkills] = useState(portfolioData.skills || []);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Intermediate");

  const fetchSkills = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.get("/api/portfolio/get-portfolio-data");
      setSkills(response.data.skills);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to fetch skills");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAddSkillCategory = async () => {
    if (!newSkillCategory) return message.error("Category name is required");

    const newCategory = {
      title: newSkillCategory,
      skills: [],
    };

    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/portfolio/add-skill-category", newCategory);
      setSkills([...skills, response.data.data]);
      setNewSkillCategory("");
      dispatch(HideLoading());
      message.success("Skill category added successfully");
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to add skill category");
    }
  };

  const handleRemoveSkillCategory = async (index) => {
    const categoryToRemove = skills[index];
    try {
      dispatch(ShowLoading());
      await axios.post("/api/portfolio/delete-skill", { _id: categoryToRemove._id });
      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);
      dispatch(HideLoading());
      message.success("Skill category removed successfully");
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to remove skill category");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkillName) return message.error("Skill name is required");

    const updatedSkills = [...skills];
    const skillCategory = updatedSkills[selectedSkillIndex];
    skillCategory.skills.push({
      name: newSkillName,
      level: newSkillLevel,
    });

    try {
      dispatch(ShowLoading());
      await axios.post("/api/portfolio/update-skill", skillCategory);
      setSkills(updatedSkills);
      setNewSkillName("");
      setNewSkillLevel("Intermediate");
      dispatch(HideLoading());
      message.success("Skill added successfully");
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skillIndex) => {
    const updatedSkills = [...skills];
    const skillCategory = updatedSkills[selectedSkillIndex];
    skillCategory.skills.splice(skillIndex, 1);

    try {
      dispatch(ShowLoading());
      await axios.post("/api/portfolio/update-skill", skillCategory);
      setSkills(updatedSkills);
      dispatch(HideLoading());
      message.success("Skill removed successfully");
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to remove skill");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="admin-icon">
            <span className="text-xl">🛠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">Skills Management</h3>
            <p className="text-gray-600">Organize your technical skills by categories and proficiency levels</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Skill Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="admin-card h-fit">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-tertiary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📂</span>
              </div>
              <h4 className="text-lg font-semibold text-primary">Categories</h4>
            </div>
            
            <div className="space-y-2 mb-6">
              {skills.map((skillCategory, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 group ${
                    selectedSkillIndex === index
                      ? 'bg-gradient-to-r from-secondary to-tertiary text-white shadow-lg'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setSelectedSkillIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skillCategory.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedSkillIndex === index 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {skillCategory.skills?.length || 0}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Add New Category */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="New category name..."
                className="admin-input w-full"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
              />
              <div className="space-y-2">
                <button
                  className="admin-btn-primary w-full text-sm"
                  onClick={handleAddSkillCategory}
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>➕</span>
                    <span>Add Category</span>
                  </span>
                </button>
                <button
                  className="admin-btn-danger w-full text-sm"
                  onClick={() => handleRemoveSkillCategory(selectedSkillIndex)}
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>🗑️</span>
                    <span>Remove</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Content */}
        <div className="lg:col-span-3">
          {skills[selectedSkillIndex] && (
            <div className="admin-card">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-tertiary rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{skills[selectedSkillIndex]?.title}</h2>
                    <p className="text-gray-600">{skills[selectedSkillIndex]?.skills?.length || 0} skills</p>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {skills[selectedSkillIndex]?.skills?.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-secondary p-4 rounded-xl transition-all duration-300 group hover:shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors">{skill.name}</h3>
                      <button
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        <span className="text-sm">🗑️</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        skill.level === 'Beginner' ? 'bg-red-100 text-red-700' :
                        skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {skill.level}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            skill.level === 'Beginner' ? 'w-1/3 bg-red-500' :
                            skill.level === 'Intermediate' ? 'w-2/3 bg-yellow-500' :
                            'w-full bg-green-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Skill */}
              <div className="bg-gradient-to-r from-secondary/5 to-tertiary/5 p-6 rounded-xl border-2 border-dashed border-gray-300">
                <h4 className="text-lg font-semibold text-primary mb-4">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Skill name (e.g., React.js, Python)..."
                      className="admin-input w-full"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className="admin-input flex-1 w-full"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                    >
                      <option value="Beginner">🌱 Beginner</option>
                      <option value="Intermediate">⚡ Intermediate</option>
                      <option value="Advanced">🚀 Advanced</option>
                    </select>
                    <button
                      className="admin-btn-primary"
                      onClick={handleAddSkill}
                    >
                      <span className="flex items-center space-x-1">
                        <span>➕</span>
                        <span>Add</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {skills.length === 0 && (
            <div className="admin-card text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Skills Categories</h3>
              <p className="text-gray-500 mb-6">Start by creating your first skill category</p>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  if (newSkillCategory) {
                    handleAddSkillCategory();
                  } else {
                    message.info("Please enter a category name first");
                  }
                }}
              >
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Create First Category</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSkill;