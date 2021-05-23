const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: [
      'id',
      'tag_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name','price','stock','category_id']
      }
    ]
  })
    .then(dbTagData => res.json(dbTagData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// router.get('/', (req, res) => {
//   console.log('======================');
//   Product.findAll({
//     include: [
//       //Category,
//       {
//         model: Product,
//         through: ProductTag
//       }
//     ]
//   })
//     .then(dbTagData => res.json(dbTagData))
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });


router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    attributes: [
      'id',
      'tag_name'
    ],
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name','price','stock','category_id']
      }
    ]
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: 'No Tag found with this id' });
        return;
      }
      res.json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
    productIds: req.body.productIds
  })
    .then((tag)=> {
     if(req.body.productIds.length) {
       const productTagIdArr = req.body.productIds.map((product_id) => {
         return {
           tag_id: tag.id,
           product_id
         };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update product data
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({message: 'No Product found with this id!'});
        return;
      }
      res.json(dbTagData);
    })
    .catch(err=> {
      console.log(err);
      res.status(500).json(err);
    })
});


module.exports = router;
