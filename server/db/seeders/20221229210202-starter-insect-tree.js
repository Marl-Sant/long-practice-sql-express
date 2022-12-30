'use strict';

const { Insect, Tree, InsectTree } = require("../models")

const newBugs = [
  {
    insect: { name: "Western Pygmy Blue Butterfly" },
    trees: [
      { tree: "General Sherman" },
      { tree: "General Grant" },
      { tree: "Lincoln" },
      { tree: "Stagg" },
    ],
  },
  {
    insect: { name: "Patu Digua Spider" },
    trees: [
      { tree: "Stagg" },
    ],
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {

    for (let insectIdx = 0; insectIdx < newBugs.length; insectIdx++) {
      const bugName = newBugs[insectIdx].insect.name
      console.log(bugName,"This is Bugname")
      const bugProfile = await Insect.findOne({ where: { name: bugName } })
      console.log(bugProfile, "This is bug profile")
      const bugId = await bugProfile.id
      console.log (bugId, "this is bug id")
      const bugAllTrees = newBugs[insectIdx].trees
      for (let treeIdx = 0; treeIdx < bugAllTrees.length; treeIdx++){
        const treeName = bugAllTrees[treeIdx].tree
        console.log(treeName, "This is tree name")
        const treeProfile = await Tree.findOne({where: {tree: treeName}})
        console.log(treeProfile, "this is tree profile")
        const treeId = await treeProfile.id
        await InsectTree.create({treeId: treeId, insectId: bugId})
      }
      }
    },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
