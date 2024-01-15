/**
 *
 * @param {import('mongoose').Model} model
 * @param {import('mongoose').PipelineStage} pipeline
 * @returns
 */
export const aggregatePagination = async (model, pipeline = [], options = {}) => {
	try {
		const response = { data: [], total: 0, page: 1 };

		pipeline.push(
			{
				$facet: {
					data: [{ $sort: options.sort }, { $skip: options.skip }, { $limit: options.limit }],
					pagination: [{ $count: 'total' }],
				},
			},
			{ $unwind: { path: '$pagination', preserveNullAndEmptyArrays: true } }
		);

		const records = await model.aggregate(pipeline);

		response.data = records[0]?.data || [];
		response.total = records[0]?.pagination?.total || 0;
		response.page = options.page;

		return response;
		//
	} catch (error) {
		return Promise.reject(error);
	}
};
