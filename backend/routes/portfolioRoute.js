const router = require('express').Router();
const {
    Header,
    Introduction,
    About,
    Skill,
    Experience,
    Project,
    Education,
    Certificate,
    Contact,
    LeftSider,
    Footer

} = require('../models/portfolioModel');
const User = require('../models/userModel');


// Get all Portfolio data

router.get('/get-portfolio-data', async (req, res) => {
    try {
        const headers = await Header.find();
        const introductions = await Introduction.find();
        const abouts = await About.find();
        const skills = await Skill.find();
        const experiences = await Experience.find();
        const projects = await Project.find();
        const educations = await Education.find();
        const certificates = await Certificate.find();
        const contacts = await Contact.find();
        const leftSides = await LeftSider.find();
        const footer = await Footer.find();

        // Add prefixes to email and phone
        if (leftSides [0]) {
            leftSides[0].email = `mailto:${leftSides[0].email}`;
            // leftSides[0].phone = `tel:+91${leftSides[0].phone}`;
        }

        res.status(200).send({
            headers: headers[0],
            introduction: introductions[0],
            about: abouts[0],
            skills: skills,
            experiences: experiences,
            projects: projects,
            educations: educations,
            certificates: certificates,
            contacts: contacts[0],
            leftSides: leftSides[0],
            footer: footer[0]
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Header data

router.post('/update-headers', async (req, res) => {
    try {
        const headers = await Header.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: headers,
            success: true,
            message: 'Header data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Introduction data

router.post('/update-introduction', async (req, res) => {
    try {
        const introduction = await Introduction.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: introduction,
            success: true,
            message: 'Introduction data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Portfolio About data

router.post('/update-about', async (req, res) => {
    try {
        const about = await About.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: about,
            success: true,
            message: 'About data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});



// Add a new skill category
router.post("/add-skill-category", async (req, res) => {
  try {
    const newCategory = new Skill(req.body);
    await newCategory.save();
    res.status(200).send({ success: true, message: "Skill category added successfully", data: newCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to add skill category" });
  }
});

// Update a skill category
router.post("/update-skill", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.status(200).send({ success: true, message: "Skill category updated successfully", data: skill });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to update skill category" });
  }
});

// Delete a skill category
router.post("/delete-skill", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.body._id);
    res.status(200).send({ success: true, message: "Skill category deleted successfully", data: skill });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to delete skill category" });
  }
});



// Add Experience data

router.post('/add-experience', async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(200).send({
            success: true,
            message: 'Experience added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Experience data

router.post('/update-experience', async (req, res) => {
    try {
        const experience = await Experience.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: experience,
            success: true,
            message: 'Experience data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Experience data

router.post('/delete-experience', async (req, res) => {
    try {
        const experience = await Experience.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: experience,
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add Project data

router.post('/add-project', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(200).send({
            success: true,
            message: 'Project added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Project data

router.post('/update-project', async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: project,
            success: true,
            message: 'Project data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Project data

router.post('/delete-project', async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: project,
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Add Education data

router.post('/add-education', async (req, res) => {
    try {
        const education = new Education(req.body);
        await education.save();
        res.status(200).send({
            success: true,
            message: 'Education added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Education data

router.post('/update-education', async (req, res) => {
    try {
        const education = await Education.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: education,
            success: true,
            message: 'Education data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Education data

router.post('/delete-education', async (req, res) => {
    try {
        const education = await Education.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: education,
            success: true,
            message: 'Education deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add Certificate data

router.post('/add-certificate', async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(200).send({
            success: true,
            message: 'Certificate added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Certificate data

router.post('/update-certificate', async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: certificate,
            success: true,
            message: 'Certificate data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Certificate data

router.post('/delete-certificate', async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: certificate,
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Portfolio LeftSider data

router.post('/update-leftSides', async (req, res) => {
    try {
        const leftSides = await LeftSider.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: leftSides,
            success: true,
            message: 'LeftSider data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Contact data

router.post('/update-contacts', async (req, res) => {
    try {
        const contacts = await Contact.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: contacts,
            success: true,
            message: 'Contact data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Footer data

router.post('/update-footer', async (req, res) => {
    try {
        const footer = await Footer.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: footer,
            success: true,
            message: 'Footer data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Admin Login

router.post('/admin-login', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });
        user.password = "";
        if (user) {
            res.status(200).send({
                success: true,
                message: "Login successful",
            });
        } else {
            res.status(200).send({
                data: user,
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;