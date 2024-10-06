import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SectionTitle from "../../components/SectionTitle";
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

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.get("/api/portfolio/get-portfolio-data");
      setSkills(response.data.skills);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error("Failed to fetch skills");
    }
  };

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
    <div>
      <SectionTitle title="Admin Skills Management" />
      <div className="flex py-10 gap-10 sm:flex-col sm:gap-8">
        {/* Skill Categories */}
        <div className="w-1/4 border-r-2 pr-5 sm:w-full">
          <div className="flex flex-col gap-5">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                <h1
                  className={`cursor-pointer text-xl ${
                    selectedSkillIndex === index
                      ? "text-emerald-950 font-semibold border-tertiary border-l-4 -ml-1 bg-[#1a7f5a31] py-2"
                      : "text-primary hover:text-tertiary"
                  }`}
                  onClick={() => setSelectedSkillIndex(index)}
                >
                  {skillCategory.title}
                </h1>
              </div>
            ))}
          </div>
          {/* Add New Skill Category */}
          <div className="mt-5">
            <input
              type="text"
              placeholder="Add New Category"
              className="border px-3 py-2 w-full"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
            />
            <div className="mt-10 flex gap-10">
              <button
                  className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                  onClick={handleAddSkillCategory}>
                Add Category
              </button>
              <button
                  className="border-2 border-primary bg-secondary text-primary font-bold px-10 py-2 rounded  hover:border-tertiary hover:text-tertiary"
                  onClick={() => handleRemoveSkillCategory(selectedSkillIndex)}
              >
                Remove Category
              </button>
            </div>
          </div>
        </div>

        {/* Skills in Selected Category */}
        <div className="w-3/4 sm:w-full">
          <h1 className="text-2xl font-bold mb-5">{skills[selectedSkillIndex]?.title}</h1>
          <div className="shadow border-2 p-8 border-tertiary hover:border-primary grid grid-cols-3 gap-4 sm:grid-cols-2">
            {skills[selectedSkillIndex]?.skills.map((skill, index) => (
                <div key={index} className="border p-5 shadow border-tertiary hover:border-secondary">
                  <h2 className="text-lg">{skill.name}</h2>
                  <p>{skill.level}</p>
                  <button
                      className="text-red-500 text-sm mt-2"
                  onClick={() => handleRemoveSkill(index)}
                >
                  Remove Skill
                </button>
              </div>
            ))}
          </div>
          {/* Add New Skill */}
          <div className="mt-5">
            <input
                type="text"
                placeholder="Add New Skill"
                className="border px-3 py-2 mr-2"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
            />
            <div className="flex gap-10 mt-10 ">
              <select
                  className="border px-2 py-2"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <button
                  className="border-2 border-primary bg-tertiary text-secondary font-bold px-10 py-2 rounded  hover:border-secondary hover:text-primary"
                  onClick={handleAddSkill}>
                Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSkill;